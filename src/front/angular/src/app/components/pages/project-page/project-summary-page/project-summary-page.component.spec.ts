import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSummaryPageComponent } from './project-summary-page.component';

describe('ProjectSummaryPageComponent', () => {
  let component: ProjectSummaryPageComponent;
  let fixture: ComponentFixture<ProjectSummaryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectSummaryPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectSummaryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
