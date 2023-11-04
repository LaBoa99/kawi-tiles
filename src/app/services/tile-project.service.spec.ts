import { TestBed } from '@angular/core/testing';

import { TileProjectService } from './tile-project.service';

describe('TileProjectService', () => {
  let service: TileProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TileProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
