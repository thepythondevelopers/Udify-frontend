import { TestBed } from '@angular/core/testing';

import { PaynowService } from './paynow.service';

describe('PaynowService', () => {
  let service: PaynowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaynowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
