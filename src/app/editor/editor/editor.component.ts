import { Component, HostListener, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectionService } from 'src/app/services/selection.service';
import { ShortcutService } from 'src/app/services/shortcut.service';
import { ToolService } from 'src/app/services/tool.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  public selection: any;

  constructor(
    private _selectionService: SelectionService,
    private _modalService: NgbModal,
    private _shortCutService: ShortcutService,
  ) {

  }
  ngOnInit(): void {
    this._selectionService.selectionBoard$.subscribe(res => {
      this.selection = res
    })
  }

  @HostListener("document:keydown", ["$event"])
  public onKeydown(event: KeyboardEvent) {
    try {
      if (this._modalService.hasOpenModals()) return;
      this._shortCutService.execute(event)
    } catch (error) { }
  }
}
