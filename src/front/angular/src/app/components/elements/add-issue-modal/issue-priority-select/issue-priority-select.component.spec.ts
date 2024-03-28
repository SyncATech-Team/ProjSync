import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuePrioritySelectComponent } from './issue-priority-select.component';

describe('IssuePrioritySelectComponent', () => {
  let component: IssuePrioritySelectComponent;
  let fixture: ComponentFixture<IssuePrioritySelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IssuePrioritySelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IssuePrioritySelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
