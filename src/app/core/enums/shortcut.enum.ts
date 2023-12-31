import { TOOLS } from "./tool.enum";

export enum SHORTCUTS {
    NEW_PROJECT = "Alt+N",
    SAVE_AS = "Alt+G",
    ADD_COL = "Alt+C",
    ADD_ROW = "Alt+R",


    // TOOLS
    PENCIL = "P",
    BUCKET = "B",
    ERASER = "E",
    RECT = "R",
    ELLIPSE = "O",
    HAND = "H",
    CURSOR = "C",
    RECT_SURFACE = "S",
    CIRCLE_SURFACE = "Alt+S",
    MAGIC_PENCIL = "M",
    TILEPICKER = "T",

    // Selection
    DELETE = "X",
    COPY = "Ctrl+C",
    PASTE = "Ctrl+V",
    CLEAR = "Alt+U",
}

export const SHORTCUT_TOOLS: Record<TOOLS, string> = {
    [TOOLS.CURSOR]: SHORTCUTS.CURSOR,
    [TOOLS.HAND]: SHORTCUTS.HAND,
    [TOOLS.PENCIL]: SHORTCUTS.PENCIL,
    [TOOLS.BUCKET]: SHORTCUTS.BUCKET,
    [TOOLS.ERASER]: SHORTCUTS.ERASER,
    [TOOLS.RECT]: SHORTCUTS.RECT,
    [TOOLS.ELLIPSE]: SHORTCUTS.ELLIPSE,
    [TOOLS.RECT_SURFACE]: SHORTCUTS.RECT_SURFACE,
    [TOOLS.CIRCLE_SURFACE]: SHORTCUTS.CIRCLE_SURFACE,
    [TOOLS.MAGIC_PENCIL]: SHORTCUTS.MAGIC_PENCIL,
    [TOOLS.TILEPICKER]: SHORTCUTS.TILEPICKER // Añade el valor correspondiente si existe
};


