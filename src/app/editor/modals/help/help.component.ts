import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent {
  constructor(
    private _activeModal: NgbActiveModal,
    private _fileServie: FileService,
  ) {

  }

  closeModal() {
    this._activeModal.close()
  }

  async downloadShortcuts() {
    await this._fileServie.downloadPublicResource("shortcuts.pdf")
  }
}
