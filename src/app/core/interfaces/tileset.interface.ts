export interface Tileset {
    x: number
    y: number
    w: number
    h: number
    cols: number
    rows: number
    gap_x: number
    gap_y: number
    tile_w: number
    tile_h: number
    title: string
    tileset?: string
    tiles?: Tile[]
}

export interface Tile {
    image: string | null | undefined
    row: number
    col: number
    id: number
}