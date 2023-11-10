import { TCoordinate, Tilemap } from './tilemap.interface';
import { Tile } from "./tileset.interface";

export interface DrawingStrategy {
    draw(tilemap: Tilemap, coordinates: TCoordinate[]): void;
}

export interface DrawingSelectionStrategy {
    select(coordinates: TCoordinate[], tilemap: Tilemap, lastDrawwed?: TCoordinate): TCoordinate[]
}