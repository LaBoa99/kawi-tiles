import { Component, OnInit } from '@angular/core';
import { ProjectComponent } from 'src/app/editor/modals/project/project.component';
import { ModalService } from 'src/app/services/modal.service';
import { AddColCommand } from '../../commands/tileproject.commad';
import { TileProject } from '../../interfaces/tileproject.interface';
import { TileProjectService } from 'src/app/services/tile-project.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public title: string = "Kawi.ktile"

  constructor(
    private _modalService: ModalService,
    private _tileProjectService: TileProjectService
  ) {

  }

  ngOnInit(): void {
    this._tileProjectService.tileproject$.subscribe(res => {
      this.title = res.title
    })
  }

  openProjectModal() {
    this._modalService.openModal(ProjectComponent)
  }

  addRow() {
    new AddColCommand(this._tileProjectService).execute()
  }

  addCol() {
    new AddColCommand(this._tileProjectService).execute()
  }
}
