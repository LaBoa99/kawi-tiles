import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Tile } from 'src/app/core/interfaces/tileset.interface';
import { PainterService } from 'src/app/services/painter.service';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit {

  public tile_primary !: Observable<Tile | undefined>
  public tile_secundary !: Observable<Tile | undefined>

  constructor(
    private _painterService: PainterService
  ) {
  }
  ngOnInit(): void {
    this.tile_primary = this._painterService.tile_primary$
    this.tile_secundary = this._painterService.tile_secundary$
  }
}
