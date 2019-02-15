import { TestBed } from '@angular/core/testing';

import { KeyboardService } from './keyboard.service';

describe('KeyboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KeyboardService = TestBed.get(KeyboardService);
    expect(service).toBeTruthy();
  });
});
