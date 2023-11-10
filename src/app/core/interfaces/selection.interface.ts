import { TCoordinate } from "./tilemap.interface";
import { SelectionTool } from "./tool.interface";

export interface SelectionProvider {
    emitSelection(tool: SelectionTool, coordinates: TCoordinate[]): void;
}