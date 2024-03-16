import { TestBed } from '@angular/core/testing';

import { ProjectVisibilityService } from './project-visibility.service';

describe('ProjectVisibilityService', () => {
  let service: ProjectVisibilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectVisibilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
