import { TestBed } from '@angular/core/testing';

import { TilemapService } from './tilemap.service';

describe('TilemapService', () => {
  let service: TilemapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TilemapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
