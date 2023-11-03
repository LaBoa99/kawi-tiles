import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TilesetModalComponent } from './tileset-modal.component';

describe('TilesetModalComponent', () => {
  let component: TilesetModalComponent;
  let fixture: ComponentFixture<TilesetModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TilesetModalComponent]
    });
    fixture = TestBed.createComponent(TilesetModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
