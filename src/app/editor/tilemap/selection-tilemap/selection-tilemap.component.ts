import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TCoordinate } from 'src/app/core/interfaces/tilemap.interface';
import { SelectionService } from 'src/app/services/selection.service';

@Component({
  selector: 'app-selection-tilemap',
  templateUrl: './selection-tilemap.component.html',
  styleUrls: ['./selection-tilemap.component.scss']
})
export class SelectionTilemapComponent implements OnInit, OnDestroy {


  private selectionSubscription !: Subscription
  public coordinates: TCoordinate[] = []

  constructor(
    private _selectionService: SelectionService
  ) { }

  ngOnInit(): void {
    this.selectionSubscription = this._selectionService.selectionBoard$.subscribe(res => {
      const [ tool, coordinates ] = res
      this.coordinates = [...coordinates]
    })
  }
  ngOnDestroy(): void {
    if(this.selectionSubscription) this.selectionSubscription.unsubscribe()
  }

}
