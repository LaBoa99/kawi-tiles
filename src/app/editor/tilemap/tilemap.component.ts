import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Tilemap } from 'src/app/core/interfaces/tilemap.interface';
import { TileProjectService } from 'src/app/services/tile-project.service';
import { TilemapService } from 'src/app/services/tilemap.service';
import { LayerType } from '../../core/enums/canvas.enum';

@Component({
  selector: 'app-tilemap',
  templateUrl: './tilemap.component.html',
  styleUrls: ['./tilemap.component.scss']
})
export class TilemapComponent implements OnInit, OnDestroy {

  public rows: number = 16
  public cols: number = 16
  public layers: Tilemap[] = []
  public dummyTilemap: Tilemap | undefined

  // Subscriptions
  private _tilemapSubscription !: Subscription
  layerType = LayerType

  constructor(
    private _tilemapService: TilemapService,
    private _tileprojectService: TileProjectService,
  ) {

  }

  ngOnDestroy(): void {
    if (this._tilemapSubscription) this._tilemapSubscription.unsubscribe()
  }

  ngOnInit(): void {
    // Cambia al tilemap seleccionado
    this._tileprojectService.tileproject$.subscribe(res => {
      this.layers = [...res.layers].reverse()
      const [rows, cols] = this._tileprojectService.getGrid()
      this.dummyTilemap = this._tilemapService.genDummyTilemap(rows, cols)
    })

    this._tilemapSubscription = this._tilemapService.tilemap$.subscribe(tilemap => {
      if (tilemap) {
        const index = tilemap.id
        if (index != -1) {
          this.layers[index] = tilemap
        }
      }
    })

  }

  trackByTilemap(index: number, tilemap: Tilemap) {
    return tilemap.id;
  }

}
