import { Component, Input } from '@angular/core';
import { ProjectDocumentService } from '../../../_service/project-document.service';
import { MessagePopupService } from '../../../_service/message-popup.service';
import { ProjectDocumentsPageComponent } from '../../pages/project-page/project-documents-page/project-documents-page.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrl: './upload-document.component.css'
})
export class UploadDocumentComponent {

  showUploadProgressBar: boolean = false;

  @Input() projectName: string = "";

  constructor(
    private projectDocService: ProjectDocumentService,
    private msgPopupService: MessagePopupService,
    private docsPage: ProjectDocumentsPageComponent,
    private translateService: TranslateService
  ) { }

  onFileSelected(event: any){
    const files: FileList = event.target.files;
    const filesArray: File[] = Array.from(files); // Convert FileList to array

    this.showUploadProgressBar = true;
    this.projectDocService.uploadDocument(this.projectName!, filesArray).subscribe({
      next: response => {
        this.showUploadProgressBar = false;
        this.translateService.get('files-uploader.files-successfully-uploaded').subscribe((res: string) => {
          this.msgPopupService.showSuccess(res);
        });
        this.docsPage.ngOnInit();
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
