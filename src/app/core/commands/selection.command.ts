import { SelectionService } from "src/app/services/selection.service";
import { CommandWithService } from "./generic.command";

export class CopySelection extends CommandWithService<SelectionService> {
    override execute(): void {
        this.service.copy()
    }
}

export class RemoveSelection extends CommandWithService<SelectionService> {
    override execute(): void {
        this.service.remove()
    }
}

export class PasteSelection extends CommandWithService<SelectionService> {
    override execute(): void {
        this.service.paste()
    }
}