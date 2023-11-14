import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditorRoutingModule } from './editor-routing.module';
import { EditorComponent } from './editor/editor.component';
import { SharedModule } from '../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TilemapComponent } from './tilemap/tilemap.component';
import { TileComponent } from './tilemap/tile/tile.component';
import { ToolsComponent } from './tools/tools.component';
import { TilesetsComponent } from './tilesets/tilesets.component';
import { TilesetComponent } from './tilesets/tileset/tileset.component';
import { TilesetModalComponent } from './tilesets/tileset-modal/tileset-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TilesetViewverComponent } from './tilesets/tileset-viewver/tileset-viewver.component';
import { LayersComponent } from './layers/layers.component';
import { LayerComponent } from './layers/layer/layer.component';
import { ProjectComponent } from './modals/project/project.component';
import { SelectionTilemapComponent } from './tilemap/selection-tilemap/selection-tilemap.component';
import { TilemapCanvasComponent } from './tilemap/tilemap-canvas/tilemap-canvas.component';
import { ExportComponent } from './modals/export/export.component';
import { HelpComponent } from './modals/help/help.component';


@NgModule({
  declarations: [
    EditorComponent,
    TilemapComponent,
    TileComponent,
    ToolsComponent,
    TilesetsComponent,
    TilesetComponent,
    TilesetModalComponent,
    TilesetViewverComponent,
    LayersComponent,
    LayerComponent,
    ProjectComponent,
    SelectionTilemapComponent,
    TilemapCanvasComponent,
    ExportComponent,
    HelpComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    EditorRoutingModule
  ]
})
export class EditorModule { }
