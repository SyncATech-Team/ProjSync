import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPeoplePageComponent } from './project-people-page.component';

describe('ProjectPeoplePageComponent', () => {
  let component: ProjectPeoplePageComponent;
  let fixture: ComponentFixture<ProjectPeoplePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectPeoplePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectPeoplePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
