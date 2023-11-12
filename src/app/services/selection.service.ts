import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { SelectionProvider } from '../core/interfaces/selection.interface';
import { TCoordinate, Tilemap } from '../core/interfaces/tilemap.interface';
import { SelectionTool } from '../core/interfaces/tool.interface';
import { TilemapService } from './tilemap.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionService implements SelectionProvider {

  private _selectionBoard = new BehaviorSubject<[SelectionTool | undefined, TCoordinate[]]>([undefined, []])
  public selectionBoard$ = this._selectionBoard.asObservable()

  private coordinatesCopies: TCoordinate[] = []

  constructor(
    private _tilemapService: TilemapService
  ) {
  }

  emitSelection(tool: SelectionTool, coordinates: TCoordinate[]): void {
    this._selectionBoard.next([tool, coordinates])
  }

  clean() {
    this._selectionBoard.next([undefined, []])
  }

  copy() {
    this.coordinatesCopies = [...this._selectionBoard.getValue()[1]]
  }

  paste() {
    if (this.coordinatesCopies.length) {

    }
  }

  remove() {

  }
}
