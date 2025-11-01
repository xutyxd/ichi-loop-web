import { TestBed } from '@angular/core/testing';

import { PadLoopService } from './pad-loop.service';

describe('PadLoopService', () => {
  let service: PadLoopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PadLoopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
