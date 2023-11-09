import { Component, Input } from '@angular/core';
import { Tile } from 'src/app/core/interfaces/tileset.interface';
import { PainterService } from 'src/app/services/painter.service';
import { TileProjectService } from 'src/app/services/tile-project.service';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent {

  @Input() tile: Tile | undefined | null

  constructor(
    private _painterService: PainterService,
  ) { }

  setTile(isSecondary: boolean = false) {
    this.tile = this._painterService.getTile(isSecondary)
  }
}
