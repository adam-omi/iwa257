import { TestBed } from '@angular/core/testing';

import { University } from './university';

describe('University', () => {
  let service: University;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(University);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
