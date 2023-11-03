import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TilesetViewverComponent } from './tileset-viewver.component';

describe('TilesetViewverComponent', () => {
  let component: TilesetViewverComponent;
  let fixture: ComponentFixture<TilesetViewverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TilesetViewverComponent]
    });
    fixture = TestBed.createComponent(TilesetViewverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
