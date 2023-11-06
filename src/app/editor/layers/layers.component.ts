import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Tilemap } from 'src/app/core/interfaces/tilemap.interface';
import { TileProjectService } from 'src/app/services/tile-project.service';
import { TilemapService } from 'src/app/services/tilemap.service';

@Component({
  selector: 'app-layers',
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.scss']
})
export class LayersComponent implements OnInit {

  public layers$ !: Observable<Tilemap[] | null | undefined>

  constructor(
    private _tilemapService: TilemapService,
    private _tileprojectService: TileProjectService
  ) {

  }

  ngOnInit(): void {
    this.layers$ = this._tilemapService.tilemaps$
  }

  createLayer() {

  }
}
