import { Injectable } from '@angular/core';
import { ExportFileTypes } from '../core/enums/export.enum';
import { FileDirector, FileTileProjectBuilder, JsonFileBuilder, MyFile, PngFileBuilder } from '../core/builders/file.builder';
import { TileProject } from '../core/interfaces/tileproject.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private _filetypes: Record<ExportFileTypes, string> = {
    [ExportFileTypes.JSON]: "json",
    [ExportFileTypes.PNG]: "png",
  }

  private _filetypesBuilders: Record<ExportFileTypes, FileTileProjectBuilder> = {
    [ExportFileTypes.JSON]: new JsonFileBuilder(),
    [ExportFileTypes.PNG]: new PngFileBuilder(),
  }

  private fileDirector !: FileDirector

  constructor(
  ) {
    this.fileDirector = new FileDirector()
  }

  async downloadPublicResource(filepath: string) {
    const resourceURL = `assets/${filepath}`
    await fetch(resourceURL)
      .then(response => response.blob())
      .then((blob: Blob) => {
        const filename = filepath.split("/").pop()
        const blobURL = URL.createObjectURL(blob)
        const link = this.createLink(filename || "archivo", blobURL)
        this.donwload(link)
      }).catch(error => {
        console.error("Error al descargar el recurso",)
      })
  }

  async downloadTileProjectFile(data: TileProject, filename: string, filetype: ExportFileTypes): Promise<void> {
    const builder = this.chooseBuilder(filetype)
    const file = await this.fileDirector.construct(builder, data, filename)
    this.donwload(file)
  }

  private createLink(filename: string, data: string) {
    const link = document.createElement('a')
    link.href = data
    link.download = filename
    return link
  }

  private donwload(link: HTMLAnchorElement): void {
    document.body.appendChild(link)
    link.click()

    window.URL.revokeObjectURL(link.href)
    document.body.removeChild(link)
  }

  private chooseFileType(filetype: ExportFileTypes): string {
    return this._filetypes[filetype]
  }

  private chooseBuilder(filetype: ExportFileTypes) {
    return this._filetypesBuilders[filetype]
  }
}
