import { TestBed } from '@angular/core/testing';

import { WebAppService } from './web-app.service';

describe('WebAppService', () => {
  let service: WebAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
