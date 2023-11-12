import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Tile } from '../core/interfaces/tileset.interface';
import { ToolService } from './tool.service';
import { TOOLS } from '../core/enums/tool.enum';
import { SelectionService } from './selection.service';
import { TCoordinate } from '../core/interfaces/tilemap.interface';
import { SelectionTool } from '../core/interfaces/tool.interface';

@Injectable({
  providedIn: 'root'
})
export class PainterService implements OnDestroy {

  public tile_primary = new BehaviorSubject<Tile | undefined>(undefined)
  public tile_primary$ = this.tile_primary.asObservable()

  public tile_secondary = new BehaviorSubject<Tile | undefined>(undefined)
  public tile_secondary$ = this.tile_secondary.asObservable()

  private selectionSubscription !: Subscription

  constructor(
    private _toolService: ToolService,
    private _selectionService: SelectionService
  ) {
    this.selectionSubscription = this._selectionService.selectionBoard$.subscribe(([tool, coordinates]) => {
      this.handleSelection(tool, coordinates)
    })
  }

  ngOnDestroy(): void {
    if (this.selectionSubscription) this.selectionSubscription.unsubscribe()
  }

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

  private handleSelection(tool: SelectionTool | undefined, coordinates: TCoordinate[]): void {
    if (!tool || this._toolService.getTool() !== TOOLS.TILEPICKER) {
      return;
    }
    const selectedTile = coordinates[0]?.tile;
    if (selectedTile) {
      this.setTile(selectedTile);
    }
  }


}
