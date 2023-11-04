import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DEFAULT_CONFIG, TOOLS } from '../core/enums/tool.enum';
import { KEYBOARD } from '../core/enums/keyboard.enum';

@Injectable({
  providedIn: 'root'
})
export class ToolService {

  private _tool = new BehaviorSubject<TOOLS>(TOOLS.CURSOR)
  public tool$ = this._tool.asObservable()

  constructor() { }

  setTool(tool: TOOLS | undefined) {
    if (tool) {
      console.log(tool)
      this._tool.next(tool)
    }
  }

  getTool() {
    return this._tool.value
  }

  getToolByKey(key: KEYBOARD): TOOLS | undefined {
    if (DEFAULT_CONFIG[key] !== undefined)
      return DEFAULT_CONFIG[key]
    return undefined
  }
}
