import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TilemapCanvasComponent } from './tilemap-canvas.component';

describe('TilemapCanvasComponent', () => {
  let component: TilemapCanvasComponent;
  let fixture: ComponentFixture<TilemapCanvasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TilemapCanvasComponent]
    });
    fixture = TestBed.createComponent(TilemapCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
