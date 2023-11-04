import { KEYBOARD } from "./keyboard.enum";


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
    PENCIL_MAGIN,
    TILEPICKER,
}

export const TOOL_ICONS: Record<TOOLS, string> = {
    [TOOLS.CURSOR]: "bi bi-cursor-fill",
    [TOOLS.HAND]: "bi bi-hand-index",
    [TOOLS.ERASER]: "bi bi-eraser-fill",

    [TOOLS.PENCIL]: "bi bi-pencil-fill",
    [TOOLS.BUCKET]: "bi bi-bucket-fill",
    [TOOLS.RECT]: "bi bi-square-fill",
    [TOOLS.ELLIPSE]: "bi bi-circle-fill",

    [TOOLS.RECT_SURFACE]: "bi bi-bounding-box-circles",
    [TOOLS.CIRCLE_SURFACE]: "bi bi-circle",
    [TOOLS.PENCIL_MAGIN]: "bi bi-magic",
    [TOOLS.TILEPICKER]: "bi bi-eyedropper",
}

export const DEFAULT_CONFIG: Partial<Record<KEYBOARD, TOOLS>> = {
    [KEYBOARD.P]: TOOLS.PENCIL,
    [KEYBOARD.B]: TOOLS.BUCKET,
    [KEYBOARD.E]: TOOLS.ERASER,
    [KEYBOARD.R]: TOOLS.RECT,
    [KEYBOARD.O]: TOOLS.ELLIPSE,
    [KEYBOARD.H]: TOOLS.HAND,
    [KEYBOARD.C]: TOOLS.CURSOR,
    [KEYBOARD.S]: TOOLS.RECT_SURFACE,
};