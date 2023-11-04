import { Component, HostListener } from '@angular/core';
import { isInKeyboard } from 'src/app/core/enums/keyboard.enum';
import { ToolService } from 'src/app/services/tool.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent {

  constructor(
    private _toolService: ToolService
  ) {

  }

  @HostListener("document:keypress", ["$event"])
  public onKeydown(event: KeyboardEvent) {
    try {
      const key = event.key
      isInKeyboard(key)
      this._toolService.setTool(this._toolService.getToolByKey(key))
    } catch (error) { }
  }
}
