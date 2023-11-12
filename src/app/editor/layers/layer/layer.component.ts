import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Tilemap } from 'src/app/core/interfaces/tilemap.interface';
import { Tile } from 'src/app/core/interfaces/tileset.interface';
import { TilemapService } from 'src/app/services/tilemap.service';

@Component({
  selector: 'app-layer',
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.scss']
})
export class LayerComponent {

  @Input() layer !: Tilemap
  @Output() click = new EventEmitter<Tilemap>()

  public selectedTilemap$ !: Observable<Tilemap | null | undefined>

  constructor(
    private _tilemapService: TilemapService
  ) {
    this.selectedTilemap$ = _tilemapService.tilemap$
  }

  toggleVisibility() {
    this.layer.visible = !this.layer.visible
  }

  onClick() {
    this.click.emit(this.layer)
  }


}
