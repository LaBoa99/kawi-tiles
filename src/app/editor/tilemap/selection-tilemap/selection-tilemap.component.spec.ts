import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionTilemapComponent } from './selection-tilemap.component';

describe('SelectionTilemapComponent', () => {
  let component: SelectionTilemapComponent;
  let fixture: ComponentFixture<SelectionTilemapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectionTilemapComponent]
    });
    fixture = TestBed.createComponent(SelectionTilemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
