import { Component } from '@angular/core';

@Component({
  selector: 'app-layer',
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.scss']
})
export class LayerComponent {


  public isVisible: boolean = true

  toggleVisibility() {
    this.isVisible = !this.isVisible
  }
}
