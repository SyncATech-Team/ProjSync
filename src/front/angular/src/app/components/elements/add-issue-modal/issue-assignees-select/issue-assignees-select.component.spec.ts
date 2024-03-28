import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueAssigneesSelectComponent } from './issue-assignees-select.component';

describe('IssueAssigneesSelectComponent', () => {
  let component: IssueAssigneesSelectComponent;
  let fixture: ComponentFixture<IssueAssigneesSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IssueAssigneesSelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IssueAssigneesSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
