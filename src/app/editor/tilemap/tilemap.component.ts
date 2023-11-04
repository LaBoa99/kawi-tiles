import { Component, ElementRef, Host, HostListener, OnInit } from '@angular/core';
import { Coord } from 'src/app/core/types/editor.type';
import { TileComponent } from './tile/tile.component';
import { Tile } from 'src/app/core/interfaces/tileset.interface';
import { Tilemap } from 'src/app/core/interfaces/tilemap.interface';
import { TilemapService } from 'src/app/services/tilemap.service';
import { PainterService } from 'src/app/services/painter.service';
import { TileProjectService } from 'src/app/services/tile-project.service';

@Component({
  selector: 'app-tilemap',
  templateUrl: './tilemap.component.html',
  styleUrls: ['./tilemap.component.scss']
})
export class TilemapComponent implements OnInit {

  public rows: number = 16
  public cols: number = 16
  public tilemap: Tilemap | null = null;
  public isLeftMouseDown: boolean = false

  private _lastTileDrawed: Coord | undefined


  constructor(
    private _tilemapService: TilemapService,
    private _tileprojectService: TileProjectService,
    private _painterService: PainterService,
    private elemetRef: ElementRef
  ) {

  }

  ngOnInit(): void {
    this._tilemapService.tilemap$.subscribe(res => this.tilemap = res)
  }


  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isLeftMouseDown && this.tilemap) {
      const [x, y] = this.calibrateCoords(event.clientX, event.clientY)
      const coords = this.getCell(x, y)
      if (coords.join() == this._lastTileDrawed?.join()) return;
      const [row, col] = coords
      this.tilemap.board[row][col] = this._painterService.getTile(false) || null
      this._lastTileDrawed = coords
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
    if (event.button == 0) [
      this.isLeftMouseDown = false
    ]
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
