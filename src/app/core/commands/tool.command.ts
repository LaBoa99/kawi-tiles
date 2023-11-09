import { ToolService } from "src/app/services/tool.service";
import { Command } from "../interfaces/command.interface";
import { CommandWithService } from "./generic.command";
import { TOOLS } from "../enums/tool.enum";

export class ToolCommand extends CommandWithService<ToolService> {
    constructor(public tool: TOOLS, service: ToolService) {
        super(service)
    }
    override execute(): void {
        this.service.setTool(this.tool)
    }
}

