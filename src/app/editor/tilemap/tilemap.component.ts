import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, buffer, debounceTime, filter, scan, takeUntil, toArray } from 'rxjs';
import { DRAWING_TOOLS_STRATEGIES, TOOLS } from 'src/app/core/enums/tool.enum';
import { TCoordinate, Tilemap } from 'src/app/core/interfaces/tilemap.interface';
import { Tool } from 'src/app/core/interfaces/tool.interface';
import { CursorTool, EraserTool } from 'src/app/core/strategies/tools';
import { Coord } from 'src/app/core/types/editor.type';
import { CameraService } from 'src/app/services/camera.service';
import { PainterService } from 'src/app/services/painter.service';
import { TileProjectService } from 'src/app/services/tile-project.service';
import { TilemapService } from 'src/app/services/tilemap.service';
import { ToolService } from 'src/app/services/tool.service';

@Component({
  selector: 'app-tilemap',
  templateUrl: './tilemap.component.html',
  styleUrls: ['./tilemap.component.scss']
})
export class TilemapComponent implements OnInit, OnDestroy {

  public rows: number = 16
  public cols: number = 16
  public tilemap: Tilemap | null | undefined = null;
  public tilemapTemp: Tilemap | null | undefined = this.tilemap
  public isLeftMouseDown: boolean = false

  private _lastTileDrawed: Coord | undefined
  private _mouseMoveSubject = new Subject<TCoordinate>()
  private _mouseStopSubject = new Subject<boolean>()

  private tool !: Tool

  // Subscriptions
  private _mouseMoveSubscription !: Subscription
  private _mouseStopSubscription !: Subscription
  private _toolSubscription !: Subscription


  constructor(
    private _tilemapService: TilemapService,
    private _toolService: ToolService,
    private _tileprojectService: TileProjectService,
    private _painterService: PainterService,
    private _cameraService: CameraService,
    private elemetRef: ElementRef
  ) {

  }

  ngOnDestroy(): void {
    if (this._mouseMoveSubscription) this._mouseMoveSubscription.unsubscribe()
    if (this._toolSubscription) this._toolSubscription.unsubscribe()
    if (this._mouseStopSubscription) this._mouseStopSubscription.unsubscribe()
  }

  ngOnInit(): void {
    this._tilemapService.tilemap$.subscribe(res => {
      console.log(res)
      this.tilemap = res
      this.tilemapTemp = structuredClone(this.tilemap)
    })

    this._toolSubscription = this._toolService.tool$.subscribe(res => {
      this.tool = DRAWING_TOOLS_STRATEGIES[res] || new CursorTool() as any
    })

    this._mouseStopSubscription = this._mouseStopSubject.asObservable().subscribe(res => {

    })

    this._mouseMoveSubscription = this._mouseMoveSubject.asObservable().pipe(
      buffer(
        this._mouseStopSubject
      ),
      filter(coordsArray => coordsArray.length > 0)
    ).subscribe(coordsArray => {
      if (this.tilemap && this.tilemapTemp) {
        coordsArray = this.tool.select(coordsArray, this.tilemap)
        this._tilemapService.setTiles(coordsArray)
      }
    })
  }


  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.select(event)
  }


  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    event.preventDefault()
    if (event.button == 0) {
      this.isLeftMouseDown = true
      this.select(event)
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (event.button == 0) {
      this.isLeftMouseDown = false
      this._mouseStopSubject.next(true)
    }
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(_event: MouseEvent) {
    this.isLeftMouseDown = false
    this._mouseStopSubject.next(true)
  }

  select(event: MouseEvent) {
    if (!this.isLeftMouseDown || !this.tilemap || !this.tilemap.board) {
      return;
    }

    const [x, y] = this.calibrateCoords(event.clientX, event.clientY);
    const [row, col] = this.getCell(x, y);

    if (this._lastTileDrawed?.join() === [row, col].join() || !this.tilemap.board[row]) {
      return;
    }


    const tile = this._painterService.getTile(false);

    this._lastTileDrawed = [row, col];
    this._mouseMoveSubject.next({ row, col, tile });
    this.tilemapTemp!.board[row][col] = tile
  }

  calibrateCoords(x: number, y: number) {
    const scaledFactor = this._cameraService.getScale()
    const scaledX = (x - this.rect.left) / scaledFactor;
    const scaledY = (y - this.rect.top) / scaledFactor;
    return [scaledX, scaledY].map(Math.floor)
  }

  getCell(x: number, y: number) {
    const [w, h] = this._tileprojectService.getSizeTile();
    const [maxRows, maxCols] = this._tileprojectService.getGrid();

    const row = Math.min(maxRows - 1, Math.max(0, Math.floor(y / h)));
    const col = Math.min(maxCols - 1, Math.max(0, Math.floor(x / w)));

    return [row, col];
  }

  get rect(): DOMRect {
    return (this.elemetRef.nativeElement as HTMLElement).getBoundingClientRect()
  }

  get tilemapToDraw() {
    return this.isLeftMouseDown ? this.tilemapTemp : this.tilemap
  }


}
