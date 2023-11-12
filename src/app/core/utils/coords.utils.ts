import { TCoordinate } from "../interfaces/tilemap.interface";
import { Coord } from "../types/editor.type";

export class CoordsUtils {
    static tcoordinateToCoord(...coordinates: TCoordinate[]): Coord[] {
        return coordinates.map(e => {
            return [e.row, e.col]
        })
    }

    static coordToTCoordinate(...coordinates: Coord[]): TCoordinate[] {
        return coordinates.map(e => {
            return {
                row: e[0],
                col: e[1],
                tile: {
                    col: -1,
                    row: -1,
                    id: -1,
                    image: null
                }
            } as TCoordinate
        })
    }

}
