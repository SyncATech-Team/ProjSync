import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIssueModalComponent } from './add-issue-modal.component';

describe('AddIssueModalComponent', () => {
  let component: AddIssueModalComponent;
  let fixture: ComponentFixture<AddIssueModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddIssueModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddIssueModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
