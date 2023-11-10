import { DrawingSelectionStrategy, DrawingStrategy } from "./draw.interface";
import { Tilemap, TCoordinate } from "./tilemap.interface";

export class Tool implements DrawingStrategy, DrawingSelectionStrategy {
    select(coordinates: TCoordinate[], tilemap: Tilemap, lastDrawwed?: TCoordinate | undefined): TCoordinate[] {
        return coordinates;
    }
    draw(tilemap: Tilemap, coordinates: TCoordinate[]): void {
        for (const coord of coordinates) {
            const { row, col, tile } = coord
            tilemap.board[row][col] = tile
        }
    }

}