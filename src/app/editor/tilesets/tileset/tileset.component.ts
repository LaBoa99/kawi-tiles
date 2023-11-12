import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tileset',
  template: `
    <div class="d-flex flex-row align-items-center justify-content-between flex-shrink-0 border-end border-secondary">
      <span (click)="onclick()" class="small flex-shrink-0"> {{ title}} </span>
      <button class="btn btn-sm border-0 h-100 flex-grow-1 me-1 ms-3" (click)="ondelete()">
        <i class="bi bi-x"></i>
      </button>
    </div>
  `,
  styleUrls: ['./tileset.component.scss']
})
export class TilesetComponent {

  @Input() title: string = "Example 1"
  @Output() onClick = new EventEmitter<boolean>()
  @Output() onDelete = new EventEmitter<boolean>()

  onclick() {
    this.onClick.emit(true)
  }

  ondelete() {
    this.onDelete.emit(true)
  }
}
