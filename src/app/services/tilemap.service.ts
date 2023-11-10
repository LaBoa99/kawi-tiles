import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TCoordinate, Tilemap } from '../core/interfaces/tilemap.interface';
import { Tile } from '../core/interfaces/tileset.interface';
import { BehaviorListController } from '../core/utils/service_behavior';
import { ToolService } from './tool.service';
import { DRAWING_TOOLS, DRAWING_TOOLS_STRATEGIES } from '../core/enums/tool.enum';
import { DrawingSelectionStrategy, DrawingStrategy } from '../core/interfaces/draw.interface';
import { CursorTool } from '../core/strategies/tools';
import { Tool } from '../core/interfaces/tool.interface';

@Injectable({
  providedIn: 'root'
})
export class TilemapService {

  private tilemapsController !: BehaviorListController<Tilemap>
  public tilemaps$ !: Observable<Tilemap[]>

  private _tilemapSubject = new BehaviorSubject<Tilemap | null | undefined>(null);
  public tilemap$: Observable<Tilemap | null | undefined> = this._tilemapSubject.asObservable();

  private tool: Tool = new CursorTool()
  constructor(
    private _toolService: ToolService
  ) {
    this.tilemapsController = new BehaviorListController<Tilemap>([])
    this.tilemaps$ = this.tilemapsController.subject$
    this._toolService.tool$.subscribe(res => {
      if (DRAWING_TOOLS.includes(res)) {
        this.tool = DRAWING_TOOLS_STRATEGIES[res] || new CursorTool() as any
      }
    })
  }

  // Stack Operations
  unshiftTilemap(tilemap: Tilemap) {
    this.tilemapsController.unshift(tilemap);
  }

  removeAtTilemap(i: number) {
    return this.tilemapsController.removeAt(i);
  }

  setTilemap(i: number, tilemap: Tilemap) {
    const result = this.tilemapsController.set(i, tilemap);
    return result
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

  getCurrentTilemap(): [index: number, tilemap: Tilemap | undefined | null] {
    const currentTilemap = this._tilemapSubject.getValue()
    if (currentTilemap == undefined || currentTilemap == null)
      return [-1, currentTilemap]
    const index = this.tilemapsController.all().indexOf(currentTilemap)
    return [index, this.tilemapsController.get(index)]
  }

  setTile(row: number, col: number, tile: Tile | null = null) {
    const currentTilemap = this._tilemapSubject.value;
    if (currentTilemap) {
      currentTilemap.board[row][col] = tile;
      this._tilemapSubject.next(currentTilemap);
    }
  }

  setTiles(coordinates: TCoordinate[]) {
    let currentTilemap = this.currentTilemap
    if (!currentTilemap) return;
    this.tool.draw(currentTilemap, coordinates)
    this._tilemapSubject.next(currentTilemap);
  }

  genLayerName(): string {
    return `Capa #${this.tilemapsController.all().length + 1}`
  }

  reset() {
    this.tilemapsController.clean()
    this._tilemapSubject.next(undefined)
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
