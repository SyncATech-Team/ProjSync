import { Component, Input } from '@angular/core';
import { ProjectDocumentService } from '../../../_service/project-document.service';
import { MessagePopupService } from '../../../_service/message-popup.service';
import { ProjectDocumentsPageComponent } from '../../pages/project-page/project-documents-page/project-documents-page.component';

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
    private docsPage: ProjectDocumentsPageComponent
  ) { }

  onFileSelected(event: any){
    const files: FileList = event.target.files;
    const filesArray: File[] = Array.from(files); // Convert FileList to array

    this.showUploadProgressBar = true;
    this.projectDocService.uploadDocument(this.projectName!, filesArray).subscribe({
      next: response => {
        this.showUploadProgressBar = false;
        this.msgPopupService.showSuccess("Files successfully uploaded.");
        this.docsPage.ngOnInit();
        event.target.value = "";
      },
      error: error => {
        this.showUploadProgressBar = false;
        this.msgPopupService.showError("Files not uploaded. Try again.");
        event.target.value = "";
      }
    });
  }

}
