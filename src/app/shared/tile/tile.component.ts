import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Tile } from 'src/app/core/interfaces/tileset.interface';
import { TileProjectService } from 'src/app/services/tile-project.service';

@Component({
  selector: 'app-tile-img',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit, OnDestroy {
  @Input() tile: Tile | null | undefined = undefined
  public w: number = 32
  public h: number = 32

  private tileSizeSubscription !: Subscription

  constructor(
    private _tileproject: TileProjectService
  ) { }

  ngOnDestroy(): void {
    if (this.tileSizeSubscription) this.tileSizeSubscription.unsubscribe()
  }

  ngOnInit(): void {
    this.tileSizeSubscription = this._tileproject.tileproject$.subscribe(res => {
      this.w = res.tile_w
      this.h = res.tile_h
    })
  }
}
