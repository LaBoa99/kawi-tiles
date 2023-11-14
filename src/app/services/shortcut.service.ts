import { Injectable } from '@angular/core';
import { CommandWithService } from '../core/commands/generic.command';
import { AddColCommand, AddRowCommand, NewProjectCommand, SaveProjectCommand } from '../core/commands/tileproject.commad';
import { SELECTION_BEHAVIORS } from '../core/enums/selection.enum';
import { SHORTCUTS, SHORTCUT_TOOLS } from '../core/enums/shortcut.enum';
import { TOOLS } from '../core/enums/tool.enum';
import { ModalService } from './modal.service';
import { SelectionService } from './selection.service';
import { TileProjectService } from './tile-project.service';
import { ToolService } from './tool.service';

@Injectable({
  providedIn: 'root'
})
export class ShortcutService {

  private shortcuts: Record<SHORTCUTS, CommandWithService<any>> = {
    // Project
    [SHORTCUTS.NEW_PROJECT]: new NewProjectCommand(this._modalService),
    [SHORTCUTS.SAVE_AS]: new SaveProjectCommand(this._modalService),
    [SHORTCUTS.ADD_COL]: new AddColCommand(this._tileprojectService),
    [SHORTCUTS.ADD_ROW]: new AddRowCommand(this._tileprojectService),

    // Tools
    [SHORTCUTS.PENCIL]: this._toolService.tools[TOOLS.PENCIL],
    [SHORTCUTS.BUCKET]: this._toolService.tools[TOOLS.BUCKET],
    [SHORTCUTS.ERASER]: this._toolService.tools[TOOLS.ERASER],
    [SHORTCUTS.RECT]: this._toolService.tools[TOOLS.RECT],
    [SHORTCUTS.ELLIPSE]: this._toolService.tools[TOOLS.ELLIPSE],
    [SHORTCUTS.HAND]: this._toolService.tools[TOOLS.HAND],
    [SHORTCUTS.CURSOR]: this._toolService.tools[TOOLS.CURSOR],
    [SHORTCUTS.RECT_SURFACE]: this._toolService.tools[TOOLS.RECT_SURFACE],
    [SHORTCUTS.CIRCLE_SURFACE]: this._toolService.tools[TOOLS.CIRCLE_SURFACE],
    [SHORTCUTS.MAGIC_PENCIL]: this._toolService.tools[TOOLS.MAGIC_PENCIL],
    [SHORTCUTS.TILEPICKER]: this._toolService.tools[TOOLS.TILEPICKER],

    // Selection
    [SHORTCUTS.DELETE]: this._selectionService.selections[SELECTION_BEHAVIORS.COPY],
    [SHORTCUTS.COPY]: this._selectionService.selections[SELECTION_BEHAVIORS.COPY],
    [SHORTCUTS.PASTE]: this._selectionService.selections[SELECTION_BEHAVIORS.PASTE],
    [SHORTCUTS.CLEAR]: this._selectionService.selections[SELECTION_BEHAVIORS.CLEAR],
  }

  constructor(
    private _tileprojectService: TileProjectService,
    private _selectionService: SelectionService,
    private _toolService: ToolService,
    private _modalService: ModalService,
  ) { }

  execute(keyboard: KeyboardEvent) {
    try {
      const shortcut = this.eventToShortcut(keyboard)
      this.isShortcut(shortcut)
      const command = this.shortcuts[shortcut]
      if (command) {
        command.execute()
      }
    } catch (error) { }
  }

  private isShortcut(shortcut: string): asserts shortcut is SHORTCUTS {
    if (!Object.values(SHORTCUTS).includes(shortcut as any)) throw new Error("Not mappign shortcut")
  }

  private eventToShortcut(event: KeyboardEvent): string {
    const key = event.key.toUpperCase();
    const ctrl = event.ctrlKey;
    const alt = event.altKey;
    if (!ctrl && !alt) {
      return key;
    }
    console.log(event)

    let result = '';
    result += ctrl ? 'Ctrl+' : '';
    result += alt ? 'Alt+' : '';
    result += key;
    return result;
  }


}
