import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Confirmable } from 'src/app/core/decorators/confirmable.decorator';
import { TCoordinate, Tilemap } from 'src/app/core/interfaces/tilemap.interface';
import { Tile } from 'src/app/core/interfaces/tileset.interface';
import { CursorSelectionTool } from 'src/app/core/strategies/tools';
import { SelectionService } from 'src/app/services/selection.service';
import { TilemapService } from 'src/app/services/tilemap.service';

@Component({
  selector: 'app-layer',
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.scss']
})
export class LayerComponent {

  @Input() layer !: Tilemap
  @Input() index: number = -1
  @Output() click = new EventEmitter<Tilemap>()

  public selectedTilemap$ !: Observable<Tilemap | null | undefined>

  constructor(
    private _tilemapService: TilemapService,
    private _selectionService: SelectionService,
  ) {
    this.selectedTilemap$ = _tilemapService.tilemap$
  }

  toggleVisibility() {
    this.layer.visible = !this.layer.visible
  }

  onClick() {
    this.click.emit(this.layer)
  }


  copy() {
    const tilemap = structuredClone(this.layer)
    tilemap.id = this._tilemapService.genLayerId()
    tilemap.name += " (Copy)"
    this._tilemapService.insertAt(this.index, tilemap)
  }

  moveUp() {
    this._tilemapService.swap(this.index, this.index + 1)
  }

  moveDown() {
    this._tilemapService.swap(this.index, this.index - 1)
  }

  select() {
    const board = this.layer.board
    const coordiantes: TCoordinate[] = []
    for (const row of board) {
      for (const tile of row) {
        if (tile.image && tile.image.length > 0) {
          coordiantes.push({ row: tile.row, col: tile.col, tile })
        }
      }
    }
    new CursorSelectionTool().emit(this._selectionService, coordiantes)
  }

  @Confirmable({}, "¿Quieres eliminar esta capa?")
  remove() {
    this._tilemapService.removeAtTilemap(this.index)
  }


}
