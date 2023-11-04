import { Component, Input } from '@angular/core';
import { Tile } from 'src/app/core/interfaces/tileset.interface';
import { PainterService } from 'src/app/services/painter.service';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent {

  @Input() tile: Tile | undefined | null
  @Input() width: number = 32
  @Input() height: number = 32

  constructor(
    private _painterService: PainterService
  ) {

  }

  setTile(isSecondary: boolean = false) {
    this.tile = this._painterService.getTile(isSecondary)
  }
}
