import { SelectionProvider } from '../interfaces/selection.interface';
import { TCoordinate, Tilemap } from '../interfaces/tilemap.interface';
import { Tile } from "../interfaces/tileset.interface";
import { SelectionTool, Tool } from "../interfaces/tool.interface";

export function isSelectionTool(object: any): object is SelectionTool {
    return "emit" in object;
}

export class CursorTool extends Tool {
    override draw(tilemap: Tilemap, coordinates: TCoordinate[]): void {
        return;
    }
}

export class PencilTool extends Tool { }

export class EraserTool extends Tool {
    override draw(tilemap: Tilemap, coordinates: TCoordinate[]): void {
        for (const coord of coordinates) {
            const { row, col, tile } = coord
            tilemap.board[row][col] = null
        }
    }
}

export class RectTool extends Tool {
    override select(coordinates: TCoordinate[], tilemap: Tilemap, lastDrawn?: TCoordinate | undefined): TCoordinate[] {
        const start = coordinates[0];
        const last = coordinates[coordinates.length - 1];
        const { tile } = start;
    
        const countCols = last.col - start.col;
        const countRows = last.row - start.row;
        const direction = {
            row: countRows == 0 ? 0 : countRows >= 1 ? 1 : -1,
            col: countCols == 0 ? 0 : countCols >= 1 ? 1 : -1,
        };
    
        const result: TCoordinate[] = [];
        for (let i = start.row; i !== last.row + direction.row; i += direction.row) {
            for (let j = start.col; j !== last.col + direction.col; j += direction.col) {
                result.push({ row: i, col: j, tile });
            }
        }
    
        return result;
    }    
}


export class BucketTool extends Tool {
    override select(coordinates: TCoordinate[], tilemap: Tilemap, lastDrawn?: TCoordinate): TCoordinate[] {
        const { row, col, tile } = coordinates[0]
        const c = this.floodFill(tilemap, row, col, tile)
        return c
    }
    private floodFill(tilemap: Tilemap, row: number, col: number, newTile: Tile | null | undefined): TCoordinate[] {
        const originalTile = tilemap.board[row][col];

        // Verificar si el azulejo actual es null o undefined
        if (originalTile?.id === newTile?.id) {
            return [];
        }

        const updatedCoordinates: TCoordinate[] = [{ row, col, tile: newTile ? { ...newTile } : newTile }];

        tilemap.board[row][col] = newTile ? { ...newTile } : newTile;

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
                const currentTile = tilemap.board[newRow][newCol];

                // Verificar si el azulejo actual es null o undefined
                if (currentTile === null || currentTile === undefined || currentTile.id === (originalTile?.id || -1)) {
                    // Concatenar las coordenadas actualizadas recursivamente
                    updatedCoordinates.push(...this.floodFill(tilemap, newRow, newCol, newTile));
                }
            }
        }
        return updatedCoordinates;
    }

}

// Selection tools 

export class RectSurfaceTool extends RectTool implements SelectionTool {
    emit(service: SelectionProvider, coordinates: TCoordinate[]): void {
        service.emitSelection(this, coordinates)
    }
    override draw(tilemap: Tilemap, coordinates: TCoordinate[]): void {
        return;
    }
}


export class MagicPencil extends BucketTool implements SelectionTool {
    emit(service: SelectionProvider, coordinates: TCoordinate[]): void {
        service.emitSelection(this, coordinates)
    }
    override draw(tilemap: Tilemap, coordinates: TCoordinate[]): void {
        return;
    }
}