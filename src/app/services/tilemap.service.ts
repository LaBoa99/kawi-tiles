import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Tilemap } from '../core/interfaces/tilemap.interface';
import { Tile } from '../core/interfaces/tileset.interface';
import { TileProjectService } from './tile-project.service';

@Injectable({
  providedIn: 'root'
})
export class TilemapService {
  private tilemaps: Tilemap[] = [];
  private _tilemapSubject = new BehaviorSubject<Tilemap | null>(null);
  public tilemap$: Observable<Tilemap | null> = this._tilemapSubject.asObservable();

  constructor(
    private tileprojectService: TileProjectService
  ) { }

  // Crea un nuevo Tilemap
  createTilemap() {
    const [rows, cols] = this.tileprojectService.getGrid()
    const newTilemap: Tilemap = { board: this.__gen_board(rows, cols) }
    this.tilemaps.push(newTilemap);
    this._tilemapSubject.next(newTilemap);
    this.selectTilemap(this.tilemaps.length - 1)
  }

  // Selecciona un Tilemap existente por índice
  selectTilemap(index: number) {
    if (index >= 0 && index < this.tilemaps.length) {
      this._tilemapSubject.next(this.tilemaps[index]);
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

  __gen_board(rows: number, cols: number): any[][] {
    const board = new Array(rows);
    for (let i = 0; i < rows; i++) {
      board[i] = new Array(cols).fill(null);
    }
    return board;
  }

  get currentTilemap(): Tilemap | null {
    return this._tilemapSubject.value;
  }
}
