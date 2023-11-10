import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Tile, Tileset } from 'src/app/core/interfaces/tileset.interface';
import { TileProjectService } from 'src/app/services/tile-project.service';
import { TilesetService } from 'src/app/services/tileset.service';

@Component({
  selector: 'app-tileset-modal',
  templateUrl: './tileset-modal.component.html',
  styleUrls: ['./tileset-modal.component.scss']
})
export class TilesetModalComponent implements OnInit, OnDestroy {

  public form !: FormGroup
  public defaultValue: Tileset | undefined

  private _tileprojectSubscription !: Subscription

  constructor(
    private modalService: NgbModal,
    private _tileProjectService: TileProjectService,
    private _tilesetService: TilesetService,
    private fb: FormBuilder
  ) { }

  ngOnDestroy(): void {
    if (this._tileprojectSubscription) this._tileprojectSubscription.unsubscribe()
    this.modalService.dismissAll()
  }


  ngOnInit(): void {
    this.form = this.fb.group({
      tileset: ["", [Validators.required]],
      title: ["", [Validators.required]],
      x: [0, [Validators.required, Validators.min(0)]],
      y: [0, [Validators.required, Validators.min(0)]],
      w: [0],
      h: [0],
      cols: [1],
      rows: [1],
      gap_x: [0, [Validators.required, Validators.min(0)]],
      gap_y: [0, [Validators.required, Validators.min(0)]],
      tile_w: [32, [Validators.required, Validators.min(1)]],
      tile_h: [32, [Validators.required, Validators.min(1)]],
    })

    this._tileprojectSubscription = this._tileProjectService.tileproject$.subscribe(res => {
      this.form.get("tile_w")?.setValue(res.tile_w)
      this.form.get("tile_h")?.setValue(res.tile_h)
    })
  }

  open(content: any) {
    this.ngOnInit()
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }).result.then(
      (_) => this.ngOnInit(),
      (_) => this.ngOnInit(),
    )
  }

  onTilesetPicked(event: Event) {
    const input = event.target as HTMLInputElement
    if (input && input?.files && input?.files.length > 0) {
      const file = input.files[0]
      if (!file.type.startsWith("image/")) return;
      this.loadImage(file).then((image) => {
        this.form.get("w")?.setValue(image.width);
        this.form.get("h")?.setValue(image.height);
        this.form.get("tileset")?.setValue(image.src);
      })
    }
  }

  loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (_) => {
        const img = new Image()
        img.onload = (_) => {
          resolve(img)
        }
        img.src = reader.result as any
      }
      reader.readAsDataURL(file);
    })
  }

  async save(modal: any) {
    const tiles = await this.getTiles()
    const data = this.form.value
    const tileset: Tileset = { ...data, tiles }
    this._tilesetService.create(tileset)
    modal.close("form submit")
  }

  getTiles(): Promise<Tile[]> {
    return new Promise((resolve, reject) => {
      if (!this.tileset_config?.tileset) {
        reject("Invalid CT");
        return;
      }

      const img = new Image();
      img.crossOrigin = "anonymous"; // Permite cargar imágenes de otros dominios

      img.onload = () => {
        const COLS = this.tileset_config.cols;
        const ROWS = this.tileset_config.rows;
        const W = img.width;
        const H = img.height;
        const TILE_W = W / COLS;
        const TILE_H = H / ROWS;

        const tiles: Tile[] = [];

        for (let i = 0; i < ROWS; i++) {
          for (let j = 0; j < COLS; j++) {
            const x = j * TILE_W + this.tileset_config.x + (this.tileset_config.gap_x * j);
            const y = i * TILE_H + this.tileset_config.y + (this.tileset_config.gap_y * i);

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            canvas.width = TILE_W;
            canvas.height = TILE_H;
            context?.drawImage(img, x, y, TILE_W, TILE_H, 0, 0, TILE_W, TILE_H);

            const imageData = context?.getImageData(0, 0, TILE_W, TILE_W).data;
            const hasNoContent = imageData?.every((channel, index) => channel == 0)
            if (hasNoContent) {
              i++
              continue
            }
            const base64 = canvas.toDataURL("image/png");
            canvas.remove()
            tiles.push({
              image: base64,
              row: i,
              col: j,
              id: i * COLS + j
            });
          }
        }

        resolve(tiles);
      };

      img.onerror = () => {
        reject("Error al cargar la imagen.");
      };

      img.src = this.tileset_config.tileset;
    });
  }


  get tileset_image() {
    return this.form.get("tileset")?.value
  }

  get tileset_config(): Tileset {
    return this.form.value
  }
}
