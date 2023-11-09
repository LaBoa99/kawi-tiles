import { Injectable } from '@angular/core';
import { CommandWithService } from '../core/commands/generic.command';
import { TileProjectService } from './tile-project.service';
import { TilemapService } from './tilemap.service';
import { ToolService } from './tool.service';
import { AddColCommand, AddRowCommand, NewProjectCommand } from '../core/commands/tileproject.commad';
import { ModalService } from './modal.service';
import { SHORTCUTS } from '../core/enums/shortcut.enum';
import { TOOLS } from '../core/enums/tool.enum';

@Injectable({
  providedIn: 'root'
})
export class ShortcutService {

  private shortcuts: Record<SHORTCUTS, CommandWithService<any>> = {
    [SHORTCUTS.NEW_PROJECT]: new NewProjectCommand(this._modalService),
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
    [SHORTCUTS.TILEPICKER]: this._toolService.tools[TOOLS.TILEPICKER]
  }

  constructor(
    private _tileprojectService: TileProjectService,
    private _tilemapService: TilemapService,
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

    let result = '';
    result += ctrl ? 'Ctrl+' : '';
    result += alt ? 'Alt+' : '';
    result += key;

    return result;
  }


}
