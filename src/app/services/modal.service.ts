import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(
    private modalService: NgbModal
  ) { }

  openModal(modal: any) {
    const modalRef = this.modalService.open(modal)
  }
}
