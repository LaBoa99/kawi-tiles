import { Injectable } from '@angular/core';
import { SelectionProvider } from '../core/interfaces/selection.interface';
import { TCoordinate, Tilemap } from '../core/interfaces/tilemap.interface';
import { SelectionTool } from '../core/interfaces/tool.interface';
import { TilemapService } from './tilemap.service';
import { TileProject } from '../core/interfaces/tileproject.interface';
import { BehaviorSubject } from 'rxjs';
import { ShortcutService } from './shortcut.service';
import { TOOLS } from '../core/enums/tool.enum';
import { CopySelection } from '../core/commands/selection.command';
import { SelectionService } from './selection.service';

@Injectable({
  providedIn: 'root'
})
export class LayerService {

  private _currentLayer: Tilemap | undefined | null = null


  constructor(
    private _tilemapService: TilemapService,
    private _selectionService: SelectionService
  ) {

    this._tilemapService.tilemap$.subscribe(res => {
      this._currentLayer = res
    })
  }


}
