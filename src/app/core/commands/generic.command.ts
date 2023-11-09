import { Command } from "../interfaces/command.interface";

export abstract class CommandWithService<T> implements Command {
    protected service: T;
    constructor(service: T) {
        this.service = service
    }

    abstract execute(): void;
}