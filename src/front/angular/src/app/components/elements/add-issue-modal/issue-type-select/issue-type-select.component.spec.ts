import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueTypeSelectComponent } from './issue-type-select.component';

describe('IssueTypeSelectComponent', () => {
  let component: IssueTypeSelectComponent;
  let fixture: ComponentFixture<IssueTypeSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IssueTypeSelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IssueTypeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
