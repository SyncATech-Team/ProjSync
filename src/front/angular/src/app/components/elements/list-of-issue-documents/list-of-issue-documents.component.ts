import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IssueDocumentationService } from '../../../_service/issue-documentation.service';
import { DocumentTitle } from '../../../_models/document-title.model';
import { MessagePopupService } from '../../../_service/message-popup.service';
import { ConfirmationService } from 'primeng/api';
import { DocumentRefreshService } from '../../../_service/documentRefreshService.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-of-issue-documents',
  templateUrl: './list-of-issue-documents.component.html',
  styleUrl: './list-of-issue-documents.component.css'
})
export class ListOfIssueDocumentsComponent implements OnInit, OnDestroy {
  @Input() issueID!: string;

  documentTitles: DocumentTitle[] = [];
  documentTitlesBackup: DocumentTitle[] = [];

  private subscription: Subscription;

  constructor(
    private issueDocumentationService: IssueDocumentationService,
    private msgPopupService: MessagePopupService,
    private confirmationService: ConfirmationService,
    private docsRefreshService: DocumentRefreshService
  ){
    this.subscription = this.docsRefreshService.refreshDocumentList.subscribe(() => { // kreiraj subscription na eventEmiter za upload dokumenata
      this.refresh();
    });
  }

  ngOnDestroy(): void { // unsubscribe zbog potencijalnik memory leakova
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() : void {
    const issueIdNumber: number = parseInt(this.issueID!, 10);
    this.issueDocumentationService.getDocumentTitles(issueIdNumber).subscribe({
      next: response => {
        this.documentTitles = response.sort(this.sortFunc);
        this.documentTitlesBackup = response.sort(this.sortFunc);
      },
      error: error => {
        console.log(error.error);
      }
    });
  }

  public refresh(){
    this.ngOnInit();
  }

  private sortFunc(a: DocumentTitle, b: DocumentTitle): number {
    if(a.dateUploaded < b.dateUploaded) return 1;
    if(a.dateUploaded == b.dateUploaded) return 0;
    return -1;
  }

  get getAllTitles(){
    console.log("POZIVVV");
    return this.documentTitles;
  }

  getTitle(current: string) {

    const LIMIT = 20;
    if (current.length < LIMIT ) return current;
    return current.substring(0, LIMIT) + "...";

  }

  private getFileType(title: string): string {
    const extension = title.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') {
      return 'pdf';
    } else if ( extension != undefined && ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension)) {
      return 'image';
    } else {
      return 'other';
    }
  }

  isPdfOrImageExtension(title: string): boolean {
    let fType = this.getFileType(title.toLowerCase());
    return fType === "pdf" || fType === "image";
  }

  downloadDocument(documentId: number, title: string) {
    this.issueDocumentationService.getDocumentContents(documentId).subscribe(data => {
      const blob = new Blob([data], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = title; // Filename for the downloaded file
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a); // Remove the <a> element after downloading
    }, error => {
      // Handle error
      console.error('Error downloading document:', error);
      this.msgPopupService.showError('Error downloading document');
    });
  }

  previewDocument(documentId: number, title: string) {
    this.issueDocumentationService.getDocumentContents(documentId).subscribe(data => {
      
      const blob = new Blob([data]);
      
      const fileType = this.getFileType(title);

      if(fileType === "pdf") {
        const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' })); // Adjust the type as per your document type
        window.open(url, '_blank'); // Open the URL in a new tab for preview
        window.URL.revokeObjectURL(url);
      }
      else if(fileType === "image") {
        const imageUrl = URL.createObjectURL(blob);
        const img = new Image();
        img.src = imageUrl;
        const w = window.open("_blank");
        w!.document.write(img.outerHTML);
      }
      else {
        this.downloadDocument(documentId, title);
      }
      
    }, error => {
      // Handle error
      console.error('Error previewing document:', error);
      this.msgPopupService.showError('Error previewing document');
    });
  }

  getIcon(fileName: string): string {
    let extension = fileName.split(".")[fileName.split(".").length-1];
    return "assets/document-type-icons/icon_" + extension + ".png";

  }

  deleteDocument(id: number, docName: string) {
    
    this.confirmationService.confirm({
      message: 'Do you want to delete this document?',
      header: 'Delete: ' + docName + "?",
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass:"p-button-danger p-button-text",
      rejectButtonStyleClass:"p-button-text p-button-text",
      acceptIcon:"none",
      rejectIcon:"none",

      accept: () => {
        this.issueDocumentationService.deleteDocument(id).subscribe({
          next: _ => {
            this.msgPopupService.showSuccess("Selected document deleted successfully");
            this.ngOnInit();
          },
          error: error => {
            this.msgPopupService.showError("Unable to delete choosen document");
          }
        });
      },
      reject: () => {

      }
    });
  }

  toggleOlderVersions(element: any) {
    element.showOlderVersions = !element.showOlderVersions;
  }
}
