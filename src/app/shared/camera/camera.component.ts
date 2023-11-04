import { Component, HostListener } from '@angular/core';
import { TOOLS } from 'src/app/core/enums/tool.enum';
import { ToolService } from 'src/app/services/tool.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent {
  translateX = 0;
  translateY = 0;
  scale = 1

  isDragging = false;
  startX = 0;
  startY = 0;

  constructor(
    private _toolService: ToolService
  ) { }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    this.changeScale(delta);
    event.preventDefault()
  }

  changeScale(delta: number) {
    this.scale += delta;
    this.scale = Math.max(0.5, this.scale)
  }

  startDragging(event: MouseEvent) {
    if (this.canGrab) {
      this.isDragging = true;
      this.startX = event.clientX;
      this.startY = event.clientY;
    }
  }

  stopDragging() {
    this.isDragging = false;
  }

  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      const deltaX = event.clientX - this.startX;
      const deltaY = event.clientY - this.startY;
      this.startX = event.clientX;
      this.startY = event.clientY;
      this.translateX += deltaX;
      this.translateY += deltaY;
    }
  }

  get canGrab() {
    return this._toolService.getTool() == TOOLS.HAND
  }
}
