import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadIssueDocumentComponent } from './upload-issue-document.component';

describe('UploadIssueDocumentComponent', () => {
  let component: UploadIssueDocumentComponent;
  let fixture: ComponentFixture<UploadIssueDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadIssueDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadIssueDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
