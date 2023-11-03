import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TilesetComponent } from './tileset.component';

describe('TilesetComponent', () => {
  let component: TilesetComponent;
  let fixture: ComponentFixture<TilesetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TilesetComponent]
    });
    fixture = TestBed.createComponent(TilesetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
