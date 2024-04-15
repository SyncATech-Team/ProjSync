import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDocumentsPageComponent } from './project-documents-page.component';

describe('ProjectDocumentsPageComponent', () => {
  let component: ProjectDocumentsPageComponent;
  let fixture: ComponentFixture<ProjectDocumentsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectDocumentsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectDocumentsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
