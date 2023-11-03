import { Component, HostListener, OnInit } from '@angular/core';
import { Coord } from 'src/app/core/types/editor.type';
import { TileComponent } from './tile/tile.component';

@Component({
  selector: 'app-tilemap',
  templateUrl: './tilemap.component.html',
  styleUrls: ['./tilemap.component.scss']
})
export class TilemapComponent implements OnInit {

  public rows: number = 16
  public cols: number = 16
  public tilemap: number[][] = []
  
  private _lastTileDrawed: Coord | undefined

  constructor() {

  }

  ngOnInit(): void {
    this.tilemap = this.__gen_board(this.rows, this.cols)
  }

  __gen_board(rows: number, cols: number): any[][] {
    const board = new Array(rows);
    for (let i = 0; i < rows; i++) {
      board[i] = new Array(cols).fill(0);
    }
    return board;
  }



  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: Event){
    if(event.target){
      
    }
  }


}
