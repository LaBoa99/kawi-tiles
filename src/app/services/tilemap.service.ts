import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TOOL_STRATEGIES } from '../core/enums/tool.enum';
import { TCoordinate, Tilemap } from '../core/interfaces/tilemap.interface';
import { Tile } from '../core/interfaces/tileset.interface';
import { Tool } from '../core/interfaces/tool.interface';
import { CursorTool } from '../core/strategies/tools';
import { BehaviorListController } from '../core/utils/service_behavior';
import { ToolService } from './tool.service';

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
      this.tool = TOOL_STRATEGIES[res] || new CursorTool() as any
    })
  }

  // Stack Operations
  unshiftTilemap(tilemap: Tilemap) {
    this.tilemapsController.unshift(tilemap);
  }

  removeAtTilemap(i: number) {
    const tilemap = this.tilemapsController.removeAt(i);
    this.selectTilemap(0)
    return tilemap
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
    const newTilemap: Tilemap = { board: this.__gen_board(rows, cols), name: this.genLayerName(), id: this.genLayerId(), visible: true }
    this.unshiftTilemap(newTilemap)
    this._tilemapSubject.next(newTilemap);
    this.selectTilemap(0)
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

  setTile(row: number, col: number, tile: Tile) {
    const currentTilemap = this._tilemapSubject.value;
    if (currentTilemap) {
      currentTilemap.board[row][col].image = tile.image;
      this._tilemapSubject.next(currentTilemap);
    }
  }

  setTiles(coordinates: TCoordinate[], tool?: Tool) {
    let currentTilemap = this.currentTilemap
    if (!currentTilemap) return;

    // Esto nos funciona para saber si se requiere otra herramienta al a seleccionada como por ejemplo las de seleccion
    const toolToDraw = tool == undefined ? this.tool : tool
    toolToDraw.draw(currentTilemap, coordinates)
    this._tilemapSubject.next(currentTilemap);
  }

  genLayerName(): string {
    return `Capa #${this.tilemapsController.all().length + 1}`
  }
  genLayerId(): number {
    return this.tilemapsController.all().length
  }

  reset() {
    this.tilemapsController.clean()
    this._tilemapSubject.next(undefined)
  }

  genDummyTilemap(rows: number, cols: number): Tilemap {
    return {
      board: this.__gen_board(rows, cols),
      id: -1,
      name: "Dummy",
      visible: true,
    }
  }

  private __gen_board(rows: number, cols: number): Tile[][] {
    const board: Tile[][] = new Array(rows);
    for (let i = 0; i < rows; i++) {
      board[i] = new Array(cols)
      for (let j = 0; j < cols; j++) {
        board[i][j] = { row: i, col: j, image: null, id: (i * cols) + j }
      }
    }
    return board;
  }

  get currentTilemap(): Tilemap | null | undefined {
    return this._tilemapSubject.value;
  }
}
