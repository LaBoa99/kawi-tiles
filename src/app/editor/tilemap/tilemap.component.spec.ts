import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TilemapComponent } from './tilemap.component';

describe('TilemapComponent', () => {
  let component: TilemapComponent;
  let fixture: ComponentFixture<TilemapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TilemapComponent]
    });
    fixture = TestBed.createComponent(TilemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
