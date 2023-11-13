import { Injectable, Injector, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DEFAULT_TILEPROJECT, TileProject } from '../core/interfaces/tileproject.interface';
import { TilemapService } from './tilemap.service';
import { Tilemap } from '../core/interfaces/tilemap.interface';
import { Tile } from '../core/interfaces/tileset.interface';

@Injectable({
  providedIn: 'root'
})
export class TileProjectService implements OnDestroy {

  private _tileproject = new BehaviorSubject<TileProject>(DEFAULT_TILEPROJECT)
  public tileproject$ = this._tileproject.asObservable()

  // Subscriptions
  private tilemaps$ !: Subscription
  private tilemap$ !: Subscription

  constructor(
    private _tilemapService: TilemapService
  ) {
    this.tilemaps$ = this._tilemapService.tilemaps$.subscribe(tilemaps => {
      const tileproject = this.tileproject
      tileproject.layers = tilemaps
      if (tileproject) {
        this._tileproject.next(tileproject)
      }
    })

    this.tilemap$ = this._tilemapService.tilemap$.subscribe((tilemap: Tilemap | null | undefined) => {
      const tileproject = this.tileproject
      if (tilemap) {
        const index = this.tileproject.layers.indexOf(tilemap)
        if (index > -1) tileproject.layers[index] = tilemap
      }
      this._tileproject.next(tileproject)
    })

    this.createTileProject({
      cols: 8,
      rows: 8,
      layers: [],
      tile_h: 32,
      tile_w: 32,
      tilesets: [],
      title: "Prueba"
    })
  }

  ngOnDestroy(): void {
    if (this.tilemaps$) this.tilemaps$.unsubscribe()
    if (this.tilemap$) this.tilemap$.unsubscribe()
  }

  createTileProject(data: TileProject) {
    data.layers = []
    this._tilemapService.reset()
    this._tileproject.next(data)
    this.appendLayer()
  }

  appendLayer() {
    if (this.tileproject.rows > 0 && this.tileproject.cols > 0) {
      this._tilemapService.createTilemap(this.tileproject.rows, this.tileproject.cols)
    }
  }

  removeLayer(index: number) {
    if (this.tileproject.layers.length > 0) {
      this._tilemapService.removeAtTilemap(index)
    }
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

  setGrid(rows: number, cols: number) {
    const tileproject = this.tileproject
    tileproject.cols = cols
    tileproject.rows = rows
    this._tileproject.next(tileproject)
  }

  getLayers() {
    return this.tileproject.layers
  }

  setLayers(layers: Tilemap[]) {
    for (let i = 0; i < layers.length; i++) {
      this._tilemapService.setTilemap(i, layers[i])
    }
    const [index, currentTilemap] = this._tilemapService.getCurrentTilemap()
    this._tilemapService.selectTilemap(index)
  }

  genDummyTiles(n: number): Tile[] {
    const [rows, cols] = this.getGrid();
    const result: Tile[] = [];
    let id = rows * cols;

    for (let i = 0; i < n; i++) {
      result.push({ row: 1, col: 1, id: id++, image: null });
    }

    return result;
  }


  get tileproject() {
    return this._tileproject.getValue()
  }
}
