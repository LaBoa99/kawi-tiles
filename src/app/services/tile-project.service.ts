import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DEFAULT_TILEPROJECT, TileProject } from '../core/interfaces/tileproject.interface';

@Injectable({
  providedIn: 'root'
})
export class TileProjectService {

  private _tileproject = new BehaviorSubject<TileProject>(DEFAULT_TILEPROJECT)
  public tileproject = this._tileproject.asObservable()

  constructor() { }


  getTileProject() {
    return this._tileproject.getValue()
  }

  getSizeTile(): [WIDHT: number, HEIGHT: number] {
    const project = this.getTileProject()
    return [project.tile_w, project.tile_h]
  }

  getGrid(): [ROWS: number, COLS: number] {
    const project = this.getTileProject()
    return [project.rows, project.cols]
  }
}
