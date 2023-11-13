import { TOOLS } from '../enums/tool.enum';
import { SelectionProvider } from '../interfaces/selection.interface';
import { TCoordinate, Tilemap } from '../interfaces/tilemap.interface';
import { Tile } from "../interfaces/tileset.interface";
import { SelectionTool, Tool } from "../interfaces/tool.interface";
import { Coord, ICoord } from '../types/editor.type';

export function isSelectionTool(object: any): object is SelectionTool {
    return "emit" in object;
}

export class CursorTool extends Tool {
    constructor() {
        super(TOOLS.CURSOR)
    }
    override draw(tilemap: Tilemap, coordinates: TCoordinate[]): void {
        return;
    }
}

export class PencilTool extends Tool {
    constructor() {
        super(TOOLS.PENCIL)
    }
}

export class EraserTool extends Tool {
    constructor() {
        super(TOOLS.ERASER)
    }
    override draw(tilemap: Tilemap, coordinates: TCoordinate[]): void {
        for (const coord of coordinates) {
            const { row, col, tile } = coord
            tilemap.board[row][col].image = null
        }
    }
}

export class RectTool extends Tool {
    constructor() {
        super(TOOLS.RECT)
    }
    override select(coordinates: TCoordinate[], tilemap: Tilemap, lastDrawn?: TCoordinate | undefined): TCoordinate[] {
        if (coordinates.length == 1) {
            return coordinates
        }
        const start = coordinates[0];
        const last = coordinates[coordinates.length - 1];
        const { tile } = start;

        const countCols = last.col - start.col;
        const countRows = last.row - start.row;
        const direction = {
            row: countRows === 0 ? 0 : countRows >= 0 ? 1 : -1,
            col: countCols === 0 ? 0 : countCols >= 0 ? 1 : -1,
        };
        const result: TCoordinate[] = Math.abs(direction.row) == 1 && Math.abs(direction.col) == 1
            ? this.selectHasRectangle(start, last, direction, tile)
            : direction.row == 0
                ? this.selectHasLine(start.col, start.row, last.col, direction.col, true, tile)
                : this.selectHasLine(start.row, start.col, last.row, direction.row, false, tile);

        return result;
    }

    // este solo funciona si direcction es 1 o 1
    selectHasRectangle(start: TCoordinate, last: TCoordinate, direction: ICoord, tile: Tile | null | undefined) {
        const result = []
        for (let i = start.row; i !== last.row + direction.row; i += direction.row) {
            for (let j = start.col; j !== last.col + direction.col; j += direction.col) {
                result.push({ row: i, col: j, tile });
            }
        }
        return result
    }

    selectHasLine(start: number, c: number, end: number, direction: number, isX: boolean, tile: Tile | null | undefined) {
        const result = []
        for (let i = start; i !== end + direction; i += direction) {
            result.push(isX ? { row: c, col: i, tile } : { row: i, col: c, tile });
        }
        return result
    }
}

export class BucketTool extends Tool {
    constructor() {
        super(TOOLS.BUCKET)
    }
    override select(coordinates: TCoordinate[], tilemap: Tilemap, lastDrawn?: TCoordinate): TCoordinate[] {
        // retorna las coordendas y tile es el que esta en painter
        const { row, col, tile } = coordinates[0]
        if (!tile) return [];
        const coords = this.floodFill(structuredClone(tilemap), row, col, tile, tilemap.board[row][col])
        return coords
    }

    private floodFill(tilemap: Tilemap, row: number, col: number, tileToReplaceWith: Tile, tileToReplace: Tile): TCoordinate[] {
        // Verificar si ya fue visitada o si es diferente al tile a remplazar
        // por ejemplo si se da click en un tile de agua entonces reemplazara todas las de agua
        // en caso de que sea diferentes se cancela la recursion
        if (tilemap.board[row][col].id == -1 || tilemap.board[row][col].image != tileToReplace.image) {
            return [];
        }

        const updatedCoordinates: TCoordinate[] = [{ row, col, tile: { ...tileToReplaceWith } }];

        tilemap.board[row][col].image = String(tileToReplaceWith.image);
        // -1 indica que ya fue visitada
        tilemap.board[row][col].id = -1;

        const directions = [
            { row: -1, col: 0 }, // arriba
            { row: 1, col: 0 },  // abajo
            { row: 0, col: -1 }, // izquierda
            { row: 0, col: 1 }   // derecha
        ];

        for (const dir of directions) {
            const newRow = row + dir.row;
            const newCol = col + dir.col;

            if (
                newRow >= 0 && newRow < tilemap.board.length &&
                newCol >= 0 && newCol < tilemap.board[0].length
            ) {
                updatedCoordinates.push(...this.floodFill(tilemap, newRow, newCol, tileToReplaceWith, tileToReplace));
            }
        }

        return updatedCoordinates;
    }


}

// Selection tools 
export class RectSurfaceTool extends RectTool implements SelectionTool {
    constructor() {
        super()
        this.tool_id = TOOLS.RECT_SURFACE
    }
    emit(service: SelectionProvider, coordinates: TCoordinate[]): void {
        service.emitSelection(this, coordinates)
    }
    override draw(tilemap: Tilemap, coordinates: TCoordinate[]): void {
        return;
    }
}

export class TilePickerTool extends Tool implements SelectionTool {
    constructor() {
        super(TOOLS.TILEPICKER)
    }
    emit(service: SelectionProvider, coordinates: TCoordinate[]): void {
        service.emitSelection(this, coordinates)
    }
    override select(coordinates: TCoordinate[], tilemap: Tilemap, lastDrawwed?: TCoordinate | undefined): TCoordinate[] {
        const { row, col } = coordinates[0]
        const tile = tilemap.board[row][col]
        return [{ row, col, tile }]
    }
    override draw(tilemap: Tilemap, coordinates: TCoordinate[]): void {
        return;
    }

}

export class MagicPencil extends BucketTool implements SelectionTool {
    constructor() {
        super()
        this.tool_id = TOOLS.MAGIC_PENCIL
    }
    emit(service: SelectionProvider, coordinates: TCoordinate[]): void {
        service.emitSelection(this, coordinates)
    }
    override draw(tilemap: Tilemap, coordinates: TCoordinate[]): void {
        return;
    }
}