import { TestBed } from '@angular/core/testing';

import { TilesetService } from './tileset.service';

describe('TilesetService', () => {
  let service: TilesetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TilesetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
