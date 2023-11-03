import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CameraComponent } from './camera/camera.component';
import { DynamicNavComponent } from './dynamic-nav/dynamic-nav.component';



@NgModule({
  declarations: [
    CameraComponent,
    DynamicNavComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CameraComponent
  ]
})
export class SharedModule { }
