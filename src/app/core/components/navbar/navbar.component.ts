import { Component, OnInit } from '@angular/core';
import { ProjectComponent } from 'src/app/editor/modals/project/project.component';
import { ModalService } from 'src/app/services/modal.service';
import { AddColCommand, AddRowCommand, NewProjectCommand, SaveProjectCommand } from '../../commands/tileproject.commad';
import { TileProject } from '../../interfaces/tileproject.interface';
import { TileProjectService } from 'src/app/services/tile-project.service';
import { ExportComponent } from 'src/app/editor/modals/export/export.component';
import { ClearSelection } from '../../commands/selection.command';
import { SelectionService } from 'src/app/services/selection.service';
import { HelpComponent } from 'src/app/editor/modals/help/help.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public title: string = "Kawi.ktile"

  constructor(
    private _modalService: ModalService,
    private _tileProjectService: TileProjectService,
    private _selectionService: SelectionService
  ) {

  }

  ngOnInit(): void {
    this._tileProjectService.tileproject$.subscribe(res => {
      this.title = res.title
    })
  }

  openProjectModal() {
    new NewProjectCommand(this._modalService).execute()
  }

  openExportModal() {
    new SaveProjectCommand(this._modalService).execute()
  }

  addRow() {
    new AddRowCommand(this._tileProjectService).execute()
  }

  addCol() {
    new AddColCommand(this._tileProjectService).execute()
  }

  clearSelection() {
    new ClearSelection(this._selectionService).execute()
  }

  help() {
    this._modalService.openModal(HelpComponent)
  }

}
