import { Tile, Tileset } from "./tileset.interface"

export interface Tilemap {
    board: (Tile | null)[][]
}