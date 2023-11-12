import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SelectionProvider } from '../core/interfaces/selection.interface';
import { TCoordinate } from '../core/interfaces/tilemap.interface';
import { SelectionTool } from '../core/interfaces/tool.interface';

@Injectable({
  providedIn: 'root'
})
export class SelectionService implements SelectionProvider {

  private _selectionBoard = new Subject<[SelectionTool | undefined, TCoordinate[]]>()
  public selectionBoard$ = this._selectionBoard.asObservable()

  constructor(
  ) {
  }

  emitSelection(tool: SelectionTool, coordinates: TCoordinate[]): void {
    this._selectionBoard.next([tool, coordinates])
  }

  clean() {
    this._selectionBoard.next([undefined, []])
  }
}
