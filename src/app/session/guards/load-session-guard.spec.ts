import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loadSessionGuard } from './load-session-guard';

describe('loadSessionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loadSessionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
