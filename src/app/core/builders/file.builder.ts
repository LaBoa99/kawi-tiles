import { Tilemap } from "../interfaces/tilemap.interface";
import { TileProject } from "../interfaces/tileproject.interface";

export class MyFile {
    constructor(public content: any, public type: string) {

    }
}

export interface FileTileProjectBuilder {
    buildContent(data: TileProject): void;
    buildType(): void;
    getResult(filename: string): HTMLAnchorElement;
}

export class JsonFileBuilder implements FileTileProjectBuilder {
    private file: MyFile = new MyFile(null, 'application/json');
    buildContent(data: TileProject): void {
        this.file.content = JSON.stringify(data, null, 2)
    }
    buildType(): void {
        return;
    }
    getResult(filename: string): HTMLAnchorElement {
        const blob = new Blob([this.file.content], { type: `${this.file.type}` })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')

        link.href = url
        link.download = `${filename}.${this.file.type.split("/")[1]}`
        return link
    }
}

export class PngFileBuilder implements FileTileProjectBuilder {
    private file: MyFile = new MyFile(null, 'image/png');
    buildContent(data: TileProject): void {
        const canvas = this.createCombinedCanvas(data)
        canvas.toBlob((blob: Blob | null) => {
            if (blob) {
                const reader = new FileReader()
                reader.onload = (event) => {
                    this.file.content = event.target?.result;
                }
                reader.readAsDataURL(blob);
            }
        }, this.file.type)
    }
    buildType(): void {

    }
    getResult(filename: string): HTMLAnchorElement {
        const link = document.createElement('a')
        link.href = this.file.content
        link.download = `${filename}.${this.file.type.split("/")[1]}`
        return link
    }

    private createCombinedCanvas(data: TileProject): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        const context: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
        const tileWidth = data.tile_w;
        const tileHeight = data.tile_h;

        canvas.width = data.cols * tileWidth
        canvas.height = data.rows * tileHeight

        for (const layer of data.layers) {
            if (!layer.visible) continue;
            for (const row of layer.board) {
                for (const tile of row) {
                    if (!tile.image || tile.image == "") continue;
                    const x = tile.col * tileWidth;
                    const y = tile.row * tileHeight
                    const img = new Image()
                    img.onload = () => {
                        context.drawImage(img, x, y, tileWidth, tileHeight)
                    }
                    img.src = tile.image
                }
            }
        }

        return canvas
    }
}

export class FileDirector {
    construct(builder: FileTileProjectBuilder, data: TileProject, filename: string): HTMLAnchorElement {
        builder.buildContent(data)
        builder.buildType()
        return builder.getResult(filename)
    }
}