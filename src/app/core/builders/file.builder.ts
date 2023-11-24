import { Tilemap } from "../interfaces/tilemap.interface";
import { TileProject } from "../interfaces/tileproject.interface";

export class MyFile {
    constructor(public content: any, public type: string) {

    }
}

export interface FileTileProjectBuilder {
    buildContent(data: TileProject): void;
    buildType(): void;
    getResult(filename: string): Promise<HTMLAnchorElement>;
}

export class JsonFileBuilder implements FileTileProjectBuilder {
    private file: MyFile = new MyFile(null, 'application/json');
    buildContent(data: TileProject): void {
        this.file.content = JSON.stringify(data, null, 2)
    }
    buildType(): void {
        return;
    }
    async getResult(filename: string): Promise<HTMLAnchorElement> {
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
    private canvas !: Promise<HTMLCanvasElement>

    buildContent(data: TileProject): void {
        this.canvas = this.createCombinedCanvas(data).then(r => {
            this.file.content = r.toDataURL()
            return r
        })
    }
    buildType(): void {

    }
    async getResult(filename: string): Promise<HTMLAnchorElement> {
        await this.canvas
        const link = document.createElement('a')
        link.href = this.file.content
        link.download = `${filename}.${this.file.type.split("/")[1]}`
        return link
    }

    private async createCombinedCanvas(data: TileProject): Promise<HTMLCanvasElement> {
        return new Promise(async (resolve, reject) => {
            const canvas = document.createElement('canvas');
            const context: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
            const tileWidth = data.tile_w;
            const tileHeight = data.tile_h;
            const promises: Promise<void>[] = []

            canvas.width = data.cols * tileWidth
            canvas.height = data.rows * tileHeight
            const layers = data.layers.reverse()
            for (const layer of layers) {
                if (!layer.visible) continue;
                for (const row of layer.board) {
                    for (const tile of row) {
                        if (tile.image == null || tile.image == undefined || tile.image == "") continue;
                        const x = tile.col * tileWidth;
                        const y = tile.row * tileHeight
                        const promise = this.loadImageAsync(tile.image).then(img => {
                            context.drawImage(img, x, y, tileWidth, tileHeight)
                        })
                        promises.push(promise)
                    }
                }
            }
            await Promise.all(promises)
            resolve(canvas)
        })
    }

    private loadImageAsync(src: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img)
            img.onerror = reject
            img.src = src
        })
    }
}

export class FileDirector {
    async construct(builder: FileTileProjectBuilder, data: TileProject, filename: string): Promise<HTMLAnchorElement> {
        builder.buildContent(data)
        builder.buildType()
        return builder.getResult(filename)
    }
}