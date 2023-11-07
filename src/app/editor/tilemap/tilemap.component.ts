import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, debounceTime, takeUntil, toArray } from 'rxjs';
import { TCoordinate, Tilemap } from 'src/app/core/interfaces/tilemap.interface';
import { Coord } from 'src/app/core/types/editor.type';
import { PainterService } from 'src/app/services/painter.service';
import { TileProjectService } from 'src/app/services/tile-project.service';
import { TilemapService } from 'src/app/services/tilemap.service';

@Component({
  selector: 'app-tilemap',
  templateUrl: './tilemap.component.html',
  styleUrls: ['./tilemap.component.scss']
})
export class TilemapComponent implements OnInit, OnDestroy {

  public rows: number = 16
  public cols: number = 16
  public tilemap: Tilemap | null | undefined = null;
  public isLeftMouseDown: boolean = false

  private _lastTileDrawed: Coord | undefined
  private _mouseMoveSubject = new Subject<TCoordinate>()
  private _mouseStopSubject = new Subject<boolean>()

  // Subscriptions
  private _mouseMoveSubscription !: Subscription
  private _mouseStopSubscription !: Subscription


  constructor(
    private _tilemapService: TilemapService,
    private _tileprojectService: TileProjectService,
    private _painterService: PainterService,
    private elemetRef: ElementRef
  ) {

  }

  ngOnDestroy(): void {
    if (this._mouseMoveSubscription) this._mouseMoveSubscription.unsubscribe()
  }

  ngOnInit(): void {
    this._tilemapService.tilemap$.subscribe(res => this.tilemap = res)
    this._mouseStopSubscription = this._mouseStopSubject.asObservable().pipe(
      debounceTime(1000)
    ).subscribe(_ => console.log())

    this._mouseMoveSubscription = this._mouseMoveSubject.asObservable().pipe(
      takeUntil(this._mouseStopSubject),
      toArray()
    ).subscribe(coords => {
      console.log("Emitiendo", coords)
      //this._tilemapService.setTiles(coords)
    })
  }


  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isLeftMouseDown && this.tilemap) {
      const [x, y] = this.calibrateCoords(event.clientX, event.clientY)
      const coords = this.getCell(x, y)
      if (coords.join() == this._lastTileDrawed?.join()) return;
      const [row, col] = coords
      console.log(row, col)
      const tile = this._painterService.getTile(false) || null
      this.tilemap.board[row][col] = tile
      this._lastTileDrawed = coords
      this._mouseMoveSubject.next({ row, col, tile })
    }
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if (event.button == 0) {
      this.isLeftMouseDown = true
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (event.button == 0) {
      this.isLeftMouseDown = false
      this._mouseStopSubject.next(true)
    }
  }

  calibrateCoords(x: number, y: number) {
    return [x - this.rect.left, y - this.rect.top].map(Math.floor)
  }

  getCell(x: number, y: number): [ROW: number, COL: number] {
    const [w, h] = this._tileprojectService.getSizeTile()
    return [Math.floor(y / h), Math.floor(x / w)]
  }

  get rect(): DOMRect {
    return (this.elemetRef.nativeElement as HTMLElement).getBoundingClientRect()
  }


}
