import { TestBed } from '@angular/core/testing';

import { KeyValueStorageService } from './key-value-storage.service';

describe('KeyValueStorageService', () => {
  let service: KeyValueStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyValueStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
