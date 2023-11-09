import { Tile, Tileset } from "./tileset.interface"

export interface Tilemap {
    name?: string
    board: (Tile | null | undefined)[][]
}

export interface TCoordinate {
    row: number
    col: number
    tile: Tile | null | undefined
}