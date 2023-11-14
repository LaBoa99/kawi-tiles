import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ExportFileTypes } from 'src/app/core/enums/export.enum';
import { TileProject } from 'src/app/core/interfaces/tileproject.interface';
import { FileService } from 'src/app/services/file.service';
import { TileProjectService } from 'src/app/services/tile-project.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {

  public form !: FormGroup
  public tileproject !: TileProject
  public ExportFileTypes = ExportFileTypes

  constructor(
    private _fb: FormBuilder,

    private _tileProjectService: TileProjectService,
    private _fileService: FileService,

    public activeModal: NgbActiveModal,
  ) {

  }

  ngOnInit(): void {
    this.form = this._fb.group({
      title: ["", [Validators.required]],
      filetype: [ExportFileTypes.JSON, [Validators.required]],
      embedded: [false]
    })
    this.tileproject = structuredClone(this._tileProjectService.getTileProject())
  }

  submit() {
    const metadata = this.form.value
    this._fileService.downloadTileProjectFile(this.tileproject, metadata['title'], metadata['filetype'])
  }

  closeModal() {
    this.activeModal.close()
  }

  setEmbedded(value: boolean) {
    this.form.get('embedded')?.setValue(value)
  }



}
