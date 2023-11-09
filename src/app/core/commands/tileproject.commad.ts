import { TileProjectService } from "src/app/services/tile-project.service";
import { CommandWithService } from "./generic.command";
import { ModalService } from "src/app/services/modal.service";
import { ProjectComponent } from "src/app/editor/modals/project/project.component";

export class AddRowCommand extends CommandWithService<TileProjectService> {
    override execute(): void {
        const layers = this.service.getLayers()
        const [rows, cols] = this.service.getGrid()
        this.service.setGrid(rows + 1, cols)
        for (let i = 0; i < layers.length; i++) {
            const row = new Array(cols).fill(null)
            layers[i].board.push(row)
        }
        this.service.setLayers(layers)
    }
}

export class NewProjectCommand extends CommandWithService<ModalService> {
    override execute(): void {
        this.service.openModal(ProjectComponent)
    }
}

export class AddColCommand extends CommandWithService<TileProjectService> {
    override execute(): void {
        const layers = this.service.getLayers()
        const [rows, cols] = this.service.getGrid()
        this.service.setGrid(rows, cols + 1)
        for (let i = 0; i < layers.length; i++) {
            for (let j = 0; j < rows; j++) {
                layers[i].board[j].push(null)
            }
        }
        this.service.setLayers(layers)
    }
}