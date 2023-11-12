import { Tile, Tileset } from "./tileset.interface"

export interface Tilemap {
    id: any
    name?: string
    visible: boolean
    board: Tile[][]
}

export interface TCoordinate {
    row: number
    col: number
    tile: Tile | null | undefined
}