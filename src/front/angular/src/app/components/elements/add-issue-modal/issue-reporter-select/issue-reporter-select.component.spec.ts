import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueReporterSelectComponent } from './issue-reporter-select.component';

describe('IssueReporterSelectComponent', () => {
  let component: IssueReporterSelectComponent;
  let fixture: ComponentFixture<IssueReporterSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IssueReporterSelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IssueReporterSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
