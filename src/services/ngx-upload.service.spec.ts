import { TestBed, inject } from '@angular/core/testing';

import { NgxUploadService } from './ngx-upload.service';

describe('NgxUploadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxUploadService]
    });
  });

  it('should be created', inject([NgxUploadService], (service: NgxUploadService) => {
    expect(service).toBeTruthy();
  }));
});
