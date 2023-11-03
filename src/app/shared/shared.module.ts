import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CameraComponent } from './camera/camera.component';
import { DynamicNavComponent } from './dynamic-nav/dynamic-nav.component';
import { TileComponent } from './tile/tile.component';
import { DisableContextmenuDirective } from './directives/disable-contextmenu.directive';



@NgModule({
  declarations: [
    CameraComponent,
    DynamicNavComponent,
    TileComponent,
    DisableContextmenuDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CameraComponent,
    TileComponent
  ]
})
export class SharedModule { }
