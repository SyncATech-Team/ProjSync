import { Component, Input } from '@angular/core';
import { IssueDocumentationService } from '../../../_service/issue-documentation.service';
import { MessagePopupService } from '../../../_service/message-popup.service';
import { DocumentRefreshService } from '../../../_service/documentRefreshService.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-upload-issue-document',
  templateUrl: './upload-issue-document.component.html',
  styleUrl: './upload-issue-document.component.css'
})
export class UploadIssueDocumentComponent {
  showUploadProgressBar: boolean = false;

  @Input() issueID!: string;

  constructor(
    private issueDocumentationService : IssueDocumentationService,
    private msgPopupService: MessagePopupService,
    private docsRefreshService: DocumentRefreshService,
    private translateService: TranslateService
  ){  }

  onFileSelected(event: any){
    const files: FileList = event.target.files;
    const filesArray: File[] = Array.from(files); // Convert FileList to array

    this.showUploadProgressBar = true;
    const issueIdNumber: number = parseInt(this.issueID, 10);
    this.issueDocumentationService.uploadDocument(issueIdNumber, filesArray).subscribe({
      next: response => {
        this.showUploadProgressBar = false;
        this.translateService.get('files-uploader.files-successfully-uploaded').subscribe((res: string) => {
          this.msgPopupService.showSuccess(res);
        });
        //Ovde osvezi prikaz na modalu za task
        this.docsRefreshService.refreshDocumentList.emit();
        //
        event.target.value = "";
      },
      error: error => {
        this.showUploadProgressBar = false;
        this.translateService.get('files-uploader.error-uploading-files').subscribe((res: string) => {
          this.msgPopupService.showError(res);
        });
        event.target.value = "";
      }
    });
  }
}
