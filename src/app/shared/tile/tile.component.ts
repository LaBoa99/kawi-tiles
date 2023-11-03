import { Component, Input } from '@angular/core';
import { Tile } from 'src/app/core/interfaces/tileset.interface';

@Component({
  selector: 'app-tile-img',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent {
  @Input() tile: Tile | null | undefined = undefined
}
