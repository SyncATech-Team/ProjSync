import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectKanbanPageComponent } from './project-kanban-page.component';

describe('ProjectKanbanPageComponent', () => {
  let component: ProjectKanbanPageComponent;
  let fixture: ComponentFixture<ProjectKanbanPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectKanbanPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectKanbanPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
