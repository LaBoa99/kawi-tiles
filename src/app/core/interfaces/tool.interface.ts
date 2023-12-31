import { TOOLS } from "../enums/tool.enum";
import { DrawingSelectionStrategy, DrawingStrategy } from "./draw.interface";
import { SelectionProvider } from "./selection.interface";
import { Tilemap, TCoordinate } from "./tilemap.interface";

export class Tool implements DrawingStrategy, DrawingSelectionStrategy {

    constructor(public tool_id: TOOLS) { }

    select(coordinates: TCoordinate[], tilemap: Tilemap, lastDrawwed?: TCoordinate | undefined): TCoordinate[] {
        return coordinates;
    }
    draw(tilemap: Tilemap, coordinates: TCoordinate[]): void {
        for (const coord of coordinates) {
            const { row, col, tile } = coord
            tilemap.board[row][col].image = tile?.image
        }
    }

}

export interface SelectionTool {
    emit(service: SelectionProvider, coordinates: TCoordinate[]): void
}

