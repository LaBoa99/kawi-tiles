import { Component } from '@angular/core';
import { ProjectComponent } from 'src/app/editor/modals/project/project.component';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(
    private _modalService: ModalService
  ) {

  }

  openProjectModal() {
    this._modalService.openModal(ProjectComponent)
  }
}
