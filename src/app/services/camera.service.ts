import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  private _scale$ = new BehaviorSubject<number>(1)
  public scale$ = this._scale$.asObservable()

  constructor() { }

  setScale(n: number) {
    this._scale$.next(n)
  }

  getScale(): number {
    return this._scale$.getValue()
  }


}
