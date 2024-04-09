import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectGanttPageComponent } from './project-gantt-page.component';

describe('ProjectGanttPageComponent', () => {
  let component: ProjectGanttPageComponent;
  let fixture: ComponentFixture<ProjectGanttPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectGanttPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectGanttPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
