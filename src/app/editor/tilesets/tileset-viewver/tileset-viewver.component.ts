import { AfterViewInit, Component, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { fabric } from 'fabric';
import { Tileset } from 'src/app/core/interfaces/tileset.interface';

@Component({
  selector: 'app-tileset-viewver',
  templateUrl: './tileset-viewver.component.html',
  styleUrls: ['./tileset-viewver.component.scss']
})
export class TilesetViewverComponent implements AfterViewInit, OnDestroy, OnChanges {

  @Input() tileset_image: string = ""
  @Input("config_tileset") ct !: Tileset;
  @ViewChild("tileset") tileset !: HTMLCanvasElement

  private canvas !: fabric.Canvas
  private lines: fabric.Line[] = []
  private image: fabric.Image | undefined = undefined

  constructor() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ct']) {
      if (this.canvas) {
        this.updateLines()
      }
    }
    if (changes['tileset_image']) {
      if (this.canvas) {
        this.canvas.remove(this.image as any)
        this.setImage(this.tileset_image)
      }
    }
  }

  ngOnDestroy(): void {
    this.resetCanvas()
  }

  resetCanvas() {
    if (this.canvas) {
      this.canvas.clear()
      this.canvas.dispose()
    }
  }

  ngAfterViewInit(): void {
    this.setImage(this.tileset_image)
  }

  setImage(data: string) {
    this.resetCanvas()
    this.canvas = new fabric.Canvas("tileset", {
      width: this.ct.w,
      height: this.ct.h
    })
    fabric.Image.fromURL(data, (img) => {
      img.set({
        left: 0,
        top: 0,
      })
      img.setCoords()
      img.selectable = false
      this.image = img
      this.canvas.add(img)
    })
  }

  updateLines() {
    try {
      console.log(this.ct, Object.values(this.ct));
      this.__check_ct(this.ct);
      this.removeLines();
      this.ct.rows = Math.min(Math.floor(this.ct.h / (this.ct.tile_h + this.ct.gap_y)), 100);
      this.ct.cols = Math.min(Math.floor(this.ct.w / (this.ct.tile_w + this.ct.gap_x)), 100);

      let coordinates: number[][] = []
      for (let i = 0; i < this.ct.cols; i++) {
        coordinates.push([
          this.ct.x + i * (this.ct.tile_w + this.ct.gap_x), 0,
          this.ct.x + i * (this.ct.tile_w + this.ct.gap_x), this.ct.h
        ])
      }
      for (let i = 0; i < this.ct.rows; i++) {
        coordinates.push([
          0, this.ct.y + i * (this.ct.tile_h + this.ct.gap_y),
          this.ct.w, this.ct.y + i * (this.ct.tile_h + this.ct.gap_y)
        ])
      }
      for (let coordinate of coordinates) {
        const [x, y, x2, y2] = coordinate
        this.addLine(x, y, x2, y2)
      }
    } catch (error) {
      console.error(error);
    }
  }


  addLine(startX: number, startY: number, endX: number, endY: number) {
    const line = new fabric.Line([startX, startY, endX, endY], {
      stroke: "cyan",
      strokeWidth: 1
    })
    line.selectable = false
    this.lines.push(line)
    this.canvas.add(line)
  }

  removeLines() {
    const linesToRemove: fabric.Object[] = this.lines.splice(0, this.lines.length)
    this.canvas.remove(...linesToRemove)
  }

  __check_ct(ct: Tileset): asserts ct is Tileset {
    if (!Object.values(ct).every(i => i != null && i != undefined && i != Infinity) || ct.tile_h == 0 && ct.tile_w == 0)
      throw new Error("XD")
  }

}
