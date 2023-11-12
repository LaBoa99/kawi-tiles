import { ProjectComponent } from "src/app/editor/modals/project/project.component";
import { ModalService } from "src/app/services/modal.service";
import { TileProjectService } from "src/app/services/tile-project.service";
import { CommandWithService } from "./generic.command";

export class AddRowCommand extends CommandWithService<TileProjectService> {
    override execute(): void {
        const layers = this.service.getLayers()
        const [rows, cols] = this.service.getGrid()
        for (let i = 0; i < layers.length; i++) {
            const row = this.service.genDummyTiles(cols).map((tile, index) => {
                tile.row = rows
                tile.col = index
                return tile
            })
            layers[i].board.push(row)
        }
        this.service.setGrid(rows + 1, cols)
        this.service.setLayers(layers)
    }
}

export class AddColCommand extends CommandWithService<TileProjectService> {
    override execute(): void {
        const layers = this.service.getLayers()
        const [rows, cols] = this.service.getGrid()
        let lastId = rows * cols
        for (let i = 0; i < layers.length; i++) {
            for (let j = 0; j < rows; j++) {
                layers[i].board[j].push({ row: j, col: cols, image: null, id: ++lastId })
            }
        }
        this.service.setGrid(rows, cols + 1)
        this.service.setLayers(layers)
    }
}

export class NewProjectCommand extends CommandWithService<ModalService> {
    override execute(): void {
        this.service.openModal(ProjectComponent)
    }
}
