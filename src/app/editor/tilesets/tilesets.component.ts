import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { TilesetService } from 'src/app/services/tileset.service';
import { Tile, Tileset } from '../../core/interfaces/tileset.interface';
import { PainterService } from 'src/app/services/painter.service';
import { Confirmable } from 'src/app/core/decorators/confirmable.decorator';

@Component({
  selector: 'app-tilesets',
  templateUrl: './tilesets.component.html',
  styleUrls: ['./tilesets.component.scss']
})
export class TilesetsComponent implements OnInit {
  active: number = 0
  tilesets$ !: Observable<Tileset[]>
  tiles: Tile[] = []

  constructor(
    private _tilesetService: TilesetService,
    private _painterService: PainterService,
  ) {

  }
  ngOnInit(): void {
    this.tilesets$ = this._tilesetService.tilesets$
  }

  showTiles(tileset: Tileset) {
    this.tiles = tileset.tiles || []
  }

  @Confirmable({}, "¿Quieres eliminar este Tileset?")
  removeTiles(tileset: Tileset) {
    if (this._tilesetService.remove(tileset))
      this.tiles = []
  }

  setTile(tile: Tile, isSecondary: boolean = false) {
    this._painterService.setTile(tile, isSecondary)
  }
}
