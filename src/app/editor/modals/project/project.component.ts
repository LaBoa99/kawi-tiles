import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TileProjectService } from 'src/app/services/tile-project.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  public form !: FormGroup

  constructor(
    public activeModal: NgbActiveModal,
    private _fb: FormBuilder,
    private _tileProjectService: TileProjectService
  ) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      title: ["", [Validators.required]],
      tile_h: [0, [Validators.min(0), Validators.required]],
      tile_w: [0, [Validators.min(0), Validators.required]],
      cols: [1, [Validators.required, Validators.min(1)]],
      rows: [1, [Validators.required, Validators.min(1)]],
    })
  }

  closeModal() {
    this.activeModal.close()
  }

  submit() {

  }

  get width() {
    return this.form.get("tile_w")?.value || 1
  }

  get height() {
    return this.form.get("tile_h")?.value || 1
  }
}
