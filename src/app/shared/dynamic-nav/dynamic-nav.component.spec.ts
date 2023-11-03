import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicNavComponent } from './dynamic-nav.component';

describe('DynamicNavComponent', () => {
  let component: DynamicNavComponent;
  let fixture: ComponentFixture<DynamicNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicNavComponent]
    });
    fixture = TestBed.createComponent(DynamicNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
