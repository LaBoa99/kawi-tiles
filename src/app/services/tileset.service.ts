import { Injectable } from '@angular/core';
import { Tileset } from '../core/interfaces/tileset.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { CRUD } from '../core/interfaces/crud.interface';

@Injectable({
  providedIn: 'root'
})
export class TilesetService implements CRUD<Tileset> {

  public _tilesets$: BehaviorSubject<Tileset[]> = new BehaviorSubject<Tileset[]>([])
  public tilesets$: Observable<Tileset[]> = this._tilesets$.asObservable()

  public _tilesets_last$: BehaviorSubject<Tileset | undefined> = new BehaviorSubject<Tileset | undefined>(undefined)
  public tilesets_last$: Observable<Tileset | undefined> = new BehaviorSubject<Tileset | undefined>(undefined)

  constructor() { }

  create(item: Tileset): Tileset {
    const currentTileSet = this._tilesets$.getValue()
    const newTilesets = [...currentTileSet, item]
    this._tilesets$.next(newTilesets)
    this._tilesets_last$.next(item)
    return item
  }

  readAll(): Tileset[] {
    return this._tilesets$.getValue()
  }

  read(key: string, value: any): Tileset | null | undefined {
    return this.readAll().find((e: any) => e[key] == value)
  }

  update(key: string, value: any, item: Tileset): Tileset | null | undefined {
    const tileset = this.read(key, value)
    if (!tileset) return null
    const tilesets = this.readAll()
    const updateTileset = { ...tileset, ...item };
    const index = tilesets.findIndex(e => e == tileset)
    tilesets[index] = updateTileset;
    this._tilesets$.next([...tilesets]);
    return updateTileset;
  }

  delete(key: string, value: any): boolean {
    const tilesets = this.readAll()
    const index = tilesets.findIndex((t: any) => t[key] == value)
    if (index === -1) return false
    tilesets.splice(index, 1)
    this._tilesets$.next([...tilesets])
    return true
  }


  remove(item: Tileset): boolean {
    const tilesets = this.readAll()
    const index = tilesets.findIndex((t: any) => t == item)
    if (index === -1) return false
    tilesets.splice(index, 1)
    this._tilesets$.next([...tilesets])
    return true
  }

}
