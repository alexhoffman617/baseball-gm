import { TestBed, inject } from '@angular/core/testing';

import { Feathers } from './feathers.service';

describe('Feathers', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Feathers]
    });
  });

  it('should be created', inject([Feathers], (service: Feathers) => {
    expect(service).toBeTruthy();
  }));
});
