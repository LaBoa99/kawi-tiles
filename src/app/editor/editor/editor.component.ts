import { Component, HostListener } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { isInKeyboard } from 'src/app/core/enums/keyboard.enum';
import { ShortcutService } from 'src/app/services/shortcut.service';
import { ToolService } from 'src/app/services/tool.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent {

  constructor(
    private _toolService: ToolService,
    private _modalService: NgbModal,
    private _shortCutService: ShortcutService,
  ) {

  }

  @HostListener("document:keydown", ["$event"])
  public onKeydown(event: KeyboardEvent) {
    try {
      if (this._modalService.hasOpenModals()) return;
      this._shortCutService.execute(event)
    } catch (error) { }
  }
}
