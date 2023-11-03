import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TilesetsComponent } from './tilesets.component';

describe('TilesetsComponent', () => {
  let component: TilesetsComponent;
  let fixture: ComponentFixture<TilesetsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TilesetsComponent]
    });
    fixture = TestBed.createComponent(TilesetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
