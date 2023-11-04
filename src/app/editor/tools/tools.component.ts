import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TOOL_ICONS, TOOLS } from 'src/app/core/enums/tool.enum';
import { Tile } from 'src/app/core/interfaces/tileset.interface';
import { PainterService } from 'src/app/services/painter.service';
import { ToolService } from 'src/app/services/tool.service';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit {

  public tile_primary !: Observable<Tile | undefined>
  public tile_secondary !: Observable<Tile | undefined>

  public actual_tool = this._toolService.tool$

  tools = Object.entries(TOOL_ICONS).map(e => {
    return { key: e[0], value: e[1] }
  })

  constructor(
    private _painterService: PainterService,
    private _toolService: ToolService
  ) {
  }
  ngOnInit(): void {
    this.tile_primary = this._painterService.tile_primary$
    this.tile_secondary = this._painterService.tile_secondary$
    console.log(
      Object.entries(TOOL_ICONS).map(e => {
        return { key: e[0], value: e[1] }
      })
    )
  }

  setTool(tool: string) {
    this._toolService.setTool(this.toTool(tool))
  }

  originalOrder() {
    return 0
  }

  toTool(value: any) {
    return value as TOOLS
  }

  swap() {
    this._painterService.swapTiles()
  }
}
