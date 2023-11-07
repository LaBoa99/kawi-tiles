import { Tilemap } from "./tilemap.interface"
import { Tile, Tileset } from "./tileset.interface"

export interface TileProject {
    title: string
    tile_w: number
    tile_h: number
    rows: number
    cols: number
    layers: Tilemap[]
    tilesets: Tileset[]
}

export const DEFAULT_TILEPROJECT: TileProject = {
    tile_h: 32,
    tile_w: 32,
    rows: 0,
    cols: 0,
    layers: [],
    tilesets: [],
    title: ""
}