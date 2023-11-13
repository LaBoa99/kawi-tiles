import { DrawingStrategy } from "../interfaces/draw.interface";
import { BucketTool, CursorTool, EraserTool, MagicPencil, PencilTool, RectSurfaceTool, RectTool, TilePickerTool } from "../strategies/tools";


export enum TOOLS {
    // CAMARA
    CURSOR = 1,
    HAND,

    // TOOLS DRAWING
    PENCIL,
    BUCKET,
    ERASER,
    RECT,
    ELLIPSE,

    // TOOLS SELECTION
    RECT_SURFACE,
    CIRCLE_SURFACE,
    MAGIC_PENCIL,
    TILEPICKER,
}

export const DRAWING_TOOLS: Partial<TOOLS>[] = [
    TOOLS.PENCIL,
    TOOLS.BUCKET,
    TOOLS.ERASER,
    TOOLS.RECT,
    TOOLS.ELLIPSE,
]

export const TOOL_ICONS: Partial<Record<TOOLS, string>> = {
    [TOOLS.CURSOR]: "bi bi-cursor-fill",
    [TOOLS.HAND]: "bi bi-hand-index",
    [TOOLS.ERASER]: "bi bi-eraser-fill",

    [TOOLS.PENCIL]: "bi bi-pencil-fill",
    [TOOLS.BUCKET]: "bi bi-bucket-fill",
    [TOOLS.RECT]: "bi bi-square-fill",
    // [TOOLS.ELLIPSE]: "bi bi-circle-fill",

    [TOOLS.RECT_SURFACE]: "bi bi-bounding-box-circles",
    // [TOOLS.CIRCLE_SURFACE]: "bi bi-circle",
    [TOOLS.MAGIC_PENCIL]: "bi bi-magic",
    [TOOLS.TILEPICKER]: "bi bi-eyedropper",
}

export const TOOL_STRATEGIES: Partial<Record<TOOLS, DrawingStrategy>> = {
    [TOOLS.PENCIL]: new PencilTool(),
    [TOOLS.BUCKET]: new BucketTool(),
    [TOOLS.ERASER]: new EraserTool(),
    [TOOLS.RECT]: new RectTool(),
    [TOOLS.ELLIPSE]: new CursorTool(),
    [TOOLS.RECT_SURFACE]: new RectSurfaceTool(),
    [TOOLS.TILEPICKER]: new TilePickerTool(),
    [TOOLS.MAGIC_PENCIL]: new MagicPencil()
}

export const TOOL_NAMES: Record<TOOLS, string> = {
    [TOOLS.CURSOR]: "Cursor",
    [TOOLS.HAND]: "Hand",
    [TOOLS.ERASER]: "Eraser",

    [TOOLS.PENCIL]: "Pencil",
    [TOOLS.BUCKET]: "Bucket",
    [TOOLS.RECT]: "Rectangle",
    [TOOLS.ELLIPSE]: "Ellipse",

    [TOOLS.RECT_SURFACE]: "Rectangle Surface",
    [TOOLS.CIRCLE_SURFACE]: "Circle Surface",
    [TOOLS.MAGIC_PENCIL]: "Magic Pencil",
    [TOOLS.TILEPICKER]: "Tilepicker",
};


