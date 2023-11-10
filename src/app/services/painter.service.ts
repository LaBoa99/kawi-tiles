import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tile } from '../core/interfaces/tileset.interface';
import { ToolService } from './tool.service';
import { TOOLS } from '../core/enums/tool.enum';

@Injectable({
  providedIn: 'root'
})
export class PainterService {

  public tile_primary = new BehaviorSubject<Tile | undefined>(undefined)
  public tile_primary$ = this.tile_primary.asObservable()

  public tile_secondary = new BehaviorSubject<Tile | undefined>(undefined)
  public tile_secondary$ = this.tile_secondary.asObservable()

  constructor(
    private _toolService: ToolService
  ) { }

  setTile(tile: Tile, isSecondary: boolean = false) {
    const tileEmitter = isSecondary ? this.tile_secondary : this.tile_primary
    tileEmitter.next(tile)
  }

  getTile(isSecondary: boolean = false) {
    if (this._toolService.getTool() == TOOLS.ERASER) return null
    return isSecondary ? this.tile_secondary.value : this.tile_primary.value
  }

  swapTiles() {
    const primary = this.tile_primary.getValue()
    const secondary = this.tile_secondary.getValue()

    if (primary && secondary) {
      this.setTile(primary, true);
      this.setTile(secondary, false)
    }
  }

}
