import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToolCommand } from '../core/commands/tool.command';
import { TOOLS } from '../core/enums/tool.enum';

@Injectable({
  providedIn: 'root'
})
export class ToolService {

  private _tool = new BehaviorSubject<TOOLS>(TOOLS.CURSOR)

  public tools: Record<TOOLS, ToolCommand> = {
    [TOOLS.CURSOR]: new ToolCommand(TOOLS.CURSOR, this),
    [TOOLS.HAND]: new ToolCommand(TOOLS.HAND, this),
    [TOOLS.ERASER]: new ToolCommand(TOOLS.ERASER, this),
    [TOOLS.PENCIL]: new ToolCommand(TOOLS.PENCIL, this),
    [TOOLS.BUCKET]: new ToolCommand(TOOLS.BUCKET, this),
    [TOOLS.RECT]: new ToolCommand(TOOLS.RECT, this),
    [TOOLS.ELLIPSE]: new ToolCommand(TOOLS.ELLIPSE, this),
    [TOOLS.RECT_SURFACE]: new ToolCommand(TOOLS.RECT_SURFACE, this),
    [TOOLS.MAGIC_PENCIL]: new ToolCommand(TOOLS.MAGIC_PENCIL, this),
    [TOOLS.TILEPICKER]: new ToolCommand(TOOLS.TILEPICKER, this),
    [TOOLS.CIRCLE_SURFACE]: new ToolCommand(TOOLS.CIRCLE_SURFACE, this)
  }

  public tool$ = this._tool.asObservable()

  constructor() {

  }

  setTool(tool: TOOLS | undefined) {
    if (tool) {
      console.log(tool, TOOLS.ERASER)
      this._tool.next(tool)
    }
  }

  getTool() {
    return this._tool.value
  }
}
