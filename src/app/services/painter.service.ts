import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tile } from '../core/interfaces/tileset.interface';

@Injectable({
  providedIn: 'root'
})
export class PainterService {

  public tile_primary = new BehaviorSubject<Tile | undefined>(undefined)
  public tile_primary$ = this.tile_primary.asObservable()

  public tile_secundary = new BehaviorSubject<Tile | undefined>(undefined)
  public tile_secundary$ = this.tile_secundary.asObservable()

  constructor() { }

  setTile(tile: Tile, isSecundary: boolean = false){
    const tileEmitter = isSecundary ? this.tile_secundary : this.tile_primary
    tileEmitter.next(tile)
  }

  getTile(isSecundary: boolean = false){
    return isSecundary ? this.tile_secundary.value : this.tile_primary.value
  }

}
