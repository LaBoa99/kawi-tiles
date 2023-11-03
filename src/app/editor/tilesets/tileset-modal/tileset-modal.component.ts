import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Tile, Tileset } from 'src/app/core/interfaces/tileset.interface';
import { TilesetService } from 'src/app/services/tileset.service';

@Component({
  selector: 'app-tileset-modal',
  templateUrl: './tileset-modal.component.html',
  styleUrls: ['./tileset-modal.component.scss']
})
export class TilesetModalComponent implements OnInit, OnDestroy {

  public form !: FormGroup

  constructor(
    private modalService: NgbModal,
    private tilesetService: TilesetService,
    private fb: FormBuilder
  ) {

  }

  ngOnDestroy(): void {
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
      tile_w: [0, [Validators.required, Validators.min(1)]],
      tile_h: [0, [Validators.required, Validators.min(1)]],
    })
  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }).result.then(
      (_) => this.form.reset(),
      (_) => this.form.reset(),
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

  async save() {
    const tiles = await this.getTiles()
    const data = this.form.value
    const tileset: Tileset = { ...data, tiles }
    this.tilesetService.create(tileset)
    this.modalService.dismissAll()
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
            console.log(hasNoContent)
            if (hasNoContent) {
              i++
              continue
            }
            const base64 = canvas.toDataURL("image/png");
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
