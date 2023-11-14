import { SelectionService } from "src/app/services/selection.service";
import { CommandWithService } from "./generic.command";
import { TCoordinate, Tilemap } from '../interfaces/tilemap.interface';
import { SelectionTool, Tool } from "../interfaces/tool.interface";

class SelectionCommand extends CommandWithService<SelectionService>  {
    // CUrrent tilemap selected
    protected tilemap: Tilemap | null | undefined

    // selection
    protected tool: SelectionTool | undefined
    protected selection !: TCoordinate[]
    protected copy !: TCoordinate[]
    // Mouse coords
    protected row !: number
    protected col !: number

    protected init() {
        const tilemap = this.service.tilemap
        const [tool, selection] = this.service.getSelection()
        const { row, col } = this.service.getMouseCoords()
        // const copy = this.service.getCopy() no se necesita en todos los tools 

        this.tilemap = tilemap
        this.tool = tool
        this.selection = selection
        this.row = row
        this.col = col
    }

    protected checkCoords() {
        return this.row >= 0 && this.col >= 0
    }

    protected getTilemapPortion(): TCoordinate[] {
        const result: TCoordinate[] = []
        if (this.tilemap && this.selection.length) {
            for (const coord of this.selection) {
                const { row, col } = coord
                const tile = { ...this.tilemap.board[row][col] }
                if (tile) {
                    result.push({
                        row: tile.row, col: tile.col, tile
                    })
                }
            }
        }
        return result
    }

    override execute(): void { }
}

export class ClearSelection extends SelectionCommand {
    override execute(): void {
        this.service.emitSelection(undefined, [])
    }
}

export class CopySelection extends SelectionCommand {
    override execute(): void {
        this.init()
        if (this.tilemap && this.selection.length) {
            const copy = this.getTilemapPortion()
            this.service.setCopy(copy)
        }
    }
}

export class PasteSelection extends SelectionCommand {
    override execute(): void {
        this.init()
        let copy: TCoordinate[] = this.service.getCopy()
        if (this.tilemap && this.checkCoords() && copy.length && this.tilemap.board.length) {
            const offsetX = this.col - copy[0].tile!.col; // Calcula la diferencia en las columnas
            const offsetY = this.row - copy[0].tile!.row; // Calcula la diferencia en las filas
            const pasteIn: TCoordinate[] = copy.map(coord => {
                const newRow = coord.tile!.row + offsetY;
                const newCol = coord.tile!.col + offsetX;
                coord.row = newRow
                coord.col = newCol
                return coord
            }).filter(coord => coord.row < this.tilemap!.board.length && coord.col < this.tilemap!.board[0].length)
            this.service.emitUpdateToTilemap(pasteIn, true)
        }
    }
}

export class RemoveSelection extends SelectionCommand {
    override execute(): void {
        this.init()
        if (this.tilemap && this.selection.length) {
            this.service.emitUpdateToTilemap(this.selection, false)
        }
    }
}
