import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TCoordinate, Tilemap } from '../core/interfaces/tilemap.interface';
import { Tile } from '../core/interfaces/tileset.interface';
import { BehaviorListController } from '../core/utils/service_behavior';

@Injectable({
  providedIn: 'root'
})
export class TilemapService {

  private tilemapsController !: BehaviorListController<Tilemap>
  public tilemaps$ !: Observable<Tilemap[]>

  private _tilemapSubject = new BehaviorSubject<Tilemap | null | undefined>(null);
  public tilemap$: Observable<Tilemap | null | undefined> = this._tilemapSubject.asObservable();

  constructor(
  ) {
    this.tilemapsController = new BehaviorListController<Tilemap>([])
    this.tilemaps$ = this.tilemapsController.subject$
  }

  // Stack Operations
  unshiftTilemap(tilemap: Tilemap) {
    this.tilemapsController.unshift(tilemap);
  }

  removeAtTilemap(i: number) {
    return this.tilemapsController.removeAt(i);
  }

  setTilemap(i: number, tilemap: Tilemap) {
    return this.tilemapsController.set(i, tilemap);
  }

  getTilemap(i: number): Tilemap | undefined {
    return this.tilemapsController.get(i);
  }

  // Crea un nuevo Tilemap
  createTilemap(rows: number, cols: number) {
    const newTilemap: Tilemap = { board: this.__gen_board(rows, cols), name: this.genLayerName() }
    this.unshiftTilemap(newTilemap)
    this._tilemapSubject.next(newTilemap);
    this.selectTilemap(this.tilemapsController.all().length - 1)
  }

  // Selecciona un Tilemap existente por índice
  selectTilemap(index: number) {
    if (index >= 0 && index < this.tilemapsController.all().length) {
      this._tilemapSubject.next(this.getTilemap(index));
    } else {
      this._tilemapSubject.next(null);
    }
  }

  setTile(row: number, col: number, tile: Tile | null = null) {
    const currentTilemap = this._tilemapSubject.value;
    if (currentTilemap) {
      currentTilemap.board[row][col] = tile;
      this._tilemapSubject.next(currentTilemap);
    }
  }

  setTiles(coordinates: TCoordinate[]) {
    const currentTilemap = this.currentTilemap
    if (!currentTilemap) return;
    for (const coord of coordinates) {
      const { row, col, tile } = coord
      currentTilemap.board[row][col] = tile
    }
    this._tilemapSubject.next(currentTilemap);
  }

  genLayerName(): string {
    return `Capa #${this.tilemapsController.all().length + 1}`
  }

  private __gen_board(rows: number, cols: number): any[][] {
    const board = new Array(rows);
    for (let i = 0; i < rows; i++) {
      board[i] = new Array(cols).fill(null);
    }
    return board;
  }

  get currentTilemap(): Tilemap | null | undefined {
    return this._tilemapSubject.value;
  }
}
