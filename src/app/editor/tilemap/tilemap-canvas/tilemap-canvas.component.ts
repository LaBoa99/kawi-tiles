import { AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Subject, Subscription, buffer, filter } from 'rxjs';
import { MOUSE } from 'src/app/core/enums/mouse.enum';
import { TOOL_STRATEGIES } from 'src/app/core/enums/tool.enum';
import { TCoordinate, Tilemap } from 'src/app/core/interfaces/tilemap.interface';
import { Tile } from 'src/app/core/interfaces/tileset.interface';
import { Tool } from 'src/app/core/interfaces/tool.interface';
import { CursorTool, isSelectionTool } from 'src/app/core/strategies/tools';
import { Coord } from 'src/app/core/types/editor.type';
import { CameraService } from 'src/app/services/camera.service';
import { PainterService } from 'src/app/services/painter.service';
import { SelectionService } from 'src/app/services/selection.service';
import { TileProjectService } from 'src/app/services/tile-project.service';
import { TilemapService } from 'src/app/services/tilemap.service';
import { ToolService } from 'src/app/services/tool.service';

@Component({
  selector: 'app-tilemap-canvas',
  template: `
    <canvas #surface></canvas>
  `,
  styleUrls: ['./tilemap-canvas.component.scss']
})
export class TilemapCanvasComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {

  @Input() layer !: Tilemap
  @Input() isHoverLayer: boolean = false
  @Input() isGridLayer: boolean = false

  @ViewChild("surface", { static: true })
  private canvas?: ElementRef<HTMLCanvasElement>
  private context !: CanvasRenderingContext2D | null

  // Config 
  private tile_w: number = 1
  private tile_h: number = 1
  private rows: number = 1
  private cols: number = 1
  private tool !: Tool
  public isLeftMouseDown: boolean = false

  // Others
  private _lastTileDrawed: Coord | undefined
  private lastTouchedCell: Coord | undefined

  //Observables
  private _mouseMoveSubject = new Subject<TCoordinate>()
  private _mouseStopSubject = new Subject<boolean>()

  // Subscriptions
  private _mouseMoveSubscription !: Subscription
  private _mouseStopSubscription !: Subscription
  private _toolSubscription !: Subscription
  private _tilemapSubscription !: Subscription

  constructor(
    private _tilemapService: TilemapService,
    private _toolService: ToolService,
    private _tileprojectService: TileProjectService,
    private _painterService: PainterService,
    private _cameraService: CameraService,
    private _selectionService: SelectionService,
  ) {

  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy(): void {
    if (this._mouseMoveSubscription) this._mouseMoveSubscription.unsubscribe()
    if (this._toolSubscription) this._toolSubscription.unsubscribe()
    if (this._mouseStopSubscription) this._mouseStopSubscription.unsubscribe()
    if (this._tilemapSubscription) this._tilemapSubscription.unsubscribe()
  }

  ngOnInit(): void {
    this._tileprojectService.tileproject$.subscribe(tileproject => {
      [this.tile_h, this.tile_w] = this._tileprojectService.getSizeTile();
      [this.rows, this.cols] = this._tileprojectService.getGrid();
      this.resizeCanvas()
      this.drawTilemap()
    })

    this._mouseStopSubscription = this._mouseStopSubject.asObservable().subscribe(_ => { })

    this._toolSubscription = this._toolService.tool$.subscribe(res => {
      this.tool = TOOL_STRATEGIES[res] || new CursorTool() as any
    })

    this._mouseMoveSubscription = this._mouseMoveSubject.asObservable().pipe(
      buffer(this._mouseStopSubject),
      filter(coordsArray => coordsArray.length > 0)
    ).subscribe(coordsArray => {
      const tilemap = this._tilemapService.currentTilemap;
      if (tilemap) {
        coordsArray = this.tool.select(coordsArray, tilemap)
        if (isSelectionTool(this.tool)) {
          this.tool.emit(this._selectionService, coordsArray)
        } else {
          this._tilemapService.setTiles(coordsArray)
        }
      }
    })
  }

  ngAfterViewInit(): void {
    this.resizeCanvas()
    this.drawTilemap()
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    event.preventDefault()
    if ((event.button == MOUSE.MAIN || event.button == MOUSE.SECONDARY) && this.isLeftMouseDown == false) {
      this.isLeftMouseDown = true
      this.select(event)
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (event.button == MOUSE.MAIN || event.button == MOUSE.SECONDARY) {
      this.isLeftMouseDown = false
      this._mouseStopSubject.next(true)
    }
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(_event: MouseEvent) {
    this.isLeftMouseDown = false
    this.cleanLastTounchedCell()
    this._mouseStopSubject.next(true)
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    event.preventDefault()
    const [row, col] = this.getCellByEvent(event)
    this.drawTileHover(row, col)
    // Mouse click izquierdo presionado
    if ((event.button == MOUSE.MAIN || event.button == MOUSE.SECONDARY) && this.isLeftMouseDown) {
      this.select(event)
    }
  }

  private select(event: MouseEvent) {
    const [row, col] = this.getCellByEvent(event)
    if (this._lastTileDrawed?.join() === [row, col].join() || !this.layer.board[row]) {
      return;
    }

    const tile = this._painterService.getTile(event.button == MOUSE.SECONDARY)
    this._lastTileDrawed = [row, col];
    this._mouseMoveSubject.next({ row, col, tile })
  }

  private getCellByEvent(event: MouseEvent) {
    const [x, y] = this.calibrateCoords(event.clientX, event.clientY)
    return this.getCell(x, y)
  }

  private calibrateAxis(n: number, offset: number, scale: number): number {
    return Math.floor((n - offset) / scale)
  }

  private calibrateCoords(x: number, y: number) {
    const scaledFactor = this._cameraService.getScale()
    return [this.calibrateAxis(x, this.rect.left, scaledFactor), this.calibrateAxis(y, this.rect.top, scaledFactor)]
  }

  private getCell(x: number, y: number) {
    const [w, h] = this._tileprojectService.getSizeTile();
    const [maxRows, maxCols] = this._tileprojectService.getGrid();

    const row = Math.min(maxRows - 1, Math.max(0, Math.floor(y / h)));
    const col = Math.min(maxCols - 1, Math.max(0, Math.floor(x / w)));

    return [row, col];
  }


  private resizeCanvas() {
    if (this.canvas) {
      this.context = this.surface.getContext('2d');
      this.surface.width = this.cols * this.tile_w
      this.surface.height = this.rows * this.tile_h
    }
  }


  private drawTilemap(): void {
    if (this.isGridLayer) {
      this.drawGrid()
    } else {
      this.drawLayer(this.layer)
    }
  }

  private drawGrid(): void {
    if (!this.context) return;

    const horizontalLines = this.surface.height / this.tile_h
    const verticalLines = this.surface.width / this.tile_w

    for (let i = 1; i < horizontalLines; i++) {
      this.context.beginPath()
      this.context.moveTo(0, this.tile_h * i)
      this.context.lineTo(this.surface.width, this.tile_h * i)
      this.context.stroke()
    }

    for (let i = 1; i < verticalLines; i++) {
      this.context.beginPath()
      this.context.moveTo(this.tile_w * i, 0)
      this.context.lineTo(this.tile_w * i, this.surface.height)
      this.context.stroke()
    }
  }

  private drawLayer(layer: Tilemap) {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const tile = layer.board[row][col]
        if (!tile.image) continue;
        this.drawTile(tile)
      }
    }
  }

  private drawTile(tile: Tile) {
    const img = new Image();
    img.onload = () => this.context?.drawImage(img, tile.col * this.tile_w, tile.row * this.tile_h)
    img.src = tile.image || "";
  }

  private drawTileHover(row: number, col: number) {
    if (this.context && this.isHoverLayer) {
      this.cleanLastTounchedCell()
      const [x, y] = this.coordinateToXY(row, col)
      this.context.fillStyle = 'rgba(0, 255, 255, 0.2)';
      this.context.fillRect(x, y, this.tile_w, this.tile_h)
      this.lastTouchedCell = [row, col]
    }
  }

  private cleanLastTounchedCell() {
    if (this.lastTouchedCell && this.context && this.isHoverLayer) {
      const [row, col] = this.lastTouchedCell
      const [x, y] = this.coordinateToXY(row, col)
      this.context.clearRect(x, y, this.tile_w, this.tile_h)
    }
  }

  private coordinateToXY(row: number, col: number) {
    return [this.tile_w * col, this.tile_h * row]
  }

  get rect(): DOMRect {
    return this.surface.getBoundingClientRect()
  }

  get surface() {
    return this.canvas?.nativeElement as HTMLCanvasElement
  }

}
