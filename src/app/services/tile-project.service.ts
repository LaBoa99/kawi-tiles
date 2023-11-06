import { Injectable, Injector, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DEFAULT_TILEPROJECT, TileProject } from '../core/interfaces/tileproject.interface';
import { TilemapService } from './tilemap.service';

@Injectable({
  providedIn: 'root'
})
export class TileProjectService implements OnDestroy {

  private _tileproject = new BehaviorSubject<TileProject>(DEFAULT_TILEPROJECT)
  public tileproject$ = this._tileproject.asObservable()

  // Subscriptions
  private tilemaps$ !: Subscription

  constructor(
    private _tilemapService: TilemapService
  ) {
    this.tilemaps$ = this._tilemapService.tilemaps$.subscribe(tilemaps => {
      this.tileproject.layers = tilemaps
    })
  }

  ngOnDestroy(): void {
    if (this.tilemaps$) {
      this.tilemaps$.unsubscribe()
    }
  }

  createTileProject(data: TileProject) {
    this._tilemapService.createTilemap(data.rows, data.cols)
    this._tileproject.next(data)
  }

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

  get tileproject() {
    return this._tileproject.getValue()
  }
}
