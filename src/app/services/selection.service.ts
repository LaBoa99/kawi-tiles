import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommandWithService } from '../core/commands/generic.command';
import { CopySelection, PasteSelection, RemoveSelection } from '../core/commands/selection.command';
import { SELECTION_BEHAVIORS } from '../core/enums/selection.enum';
import { SelectionProvider } from '../core/interfaces/selection.interface';
import { TCoordinate, Tilemap } from '../core/interfaces/tilemap.interface';
import { SelectionTool } from '../core/interfaces/tool.interface';
import { EraserTool, PencilTool } from '../core/strategies/tools';
import { ICoord } from '../core/types/editor.type';
import { TilemapService } from './tilemap.service';
import { ToolService } from './tool.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionService implements SelectionProvider {

  private _selectionBoard = new BehaviorSubject<[SelectionTool | undefined, TCoordinate[]]>([undefined, []])
  public selectionBoard$ = this._selectionBoard.asObservable()

  public copyCoordinates: TCoordinate[] = []
  public tilemap: Tilemap | null | undefined = null
  public mouseCoord: ICoord = { row: -1, col: -1 }

  public selections: Record<SELECTION_BEHAVIORS, CommandWithService<SelectionService>> = {
    [SELECTION_BEHAVIORS.COPY]: new CopySelection(this),
    [SELECTION_BEHAVIORS.PASTE]: new PasteSelection(this),
    [SELECTION_BEHAVIORS.DELETE]: new RemoveSelection(this)
  }

  constructor(
    private _tilemapService: TilemapService,
    private _toolService: ToolService,
  ) {
    this._tilemapService.tilemap$.subscribe(res => {
      this.tilemap = structuredClone(res)
    })
  }

  emitUpdateToTilemap(coordinates: TCoordinate[], isPencil?: boolean) {
    this._tilemapService.setTiles(coordinates, isPencil ? new PencilTool() : new EraserTool())
  }

  emitSelection(tool: SelectionTool, coordinates: TCoordinate[]): void {
    this._selectionBoard.next([tool, coordinates])
  }

  getMouseCoords(): ICoord {
    return this.mouseCoord
  }

  setMouseCoords(row: number, col: number) {
    this.mouseCoord = { row, col }
  }

  getSelection() {
    return this._selectionBoard.getValue()
  }

  getCopy() {
    return structuredClone(this.copyCoordinates)
  }

  setCopy(coords: TCoordinate[]) {
    this.copyCoordinates = structuredClone(coords)
  }

}
