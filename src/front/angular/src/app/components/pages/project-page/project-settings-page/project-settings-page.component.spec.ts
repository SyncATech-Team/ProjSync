import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSettingsPageComponent } from './project-settings-page.component';

describe('ProjectSettingsPageComponent', () => {
  let component: ProjectSettingsPageComponent;
  let fixture: ComponentFixture<ProjectSettingsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectSettingsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectSettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
