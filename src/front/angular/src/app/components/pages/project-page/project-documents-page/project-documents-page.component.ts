import { Component, Injectable, OnInit } from '@angular/core';
import { Project } from '../../../../_models/project.model';
import { ProjectService } from '../../../../_service/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagePopupService } from '../../../../_service/message-popup.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProjectTypeService } from '../../../../_service/project-type.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProjectType } from '../../../../_models/project-type';
import { ProjectDocumentService } from '../../../../_service/project-document.service'
import { DocumentTitle } from '../../../../_models/document-title.model';
import { AccountService } from '../../../../_service/account.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-project-documents-page',
  templateUrl: './project-documents-page.component.html',
  styleUrl: './project-documents-page.component.css'
})
export class ProjectDocumentsPageComponent implements OnInit{

  projectName: string = '';
  documentTitles: DocumentTitle[] = [];
  documentTitlesBackup: DocumentTitle[] = [];
  loading: boolean = false;

  permission: any;

  searchTerm: string = "";

  hasDocuments: boolean = false;

  constructor (
    public accoutService: AccountService,
    private ProjectDocService: ProjectDocumentService,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private router:Router,
    private msgPopupService: MessagePopupService,
    private formBuilder: FormBuilder,
    private projectTypeService: ProjectTypeService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private translateService: TranslateService
  ){

      this.projectName = route.snapshot.paramMap.get('projectName')!;
    
    };

  ngOnInit(): void {

    var user = this.accoutService.getCurrentUser();
    if(user?.permitions){
      this.permission = user.permitions;
    }

    this.ProjectDocService.getDocumentTitles(this.projectName).subscribe({
      next: response => {
        this.documentTitles = response.sort(this.sortFunc);
        this.documentTitlesBackup = response.sort(this.sortFunc);
        this.hasDocuments = this.documentTitles.length > 0;
      },
      error: error => {
        console.log(error.error);
      }
    })
  }

  private sortFunc(a: DocumentTitle, b: DocumentTitle): number {
    if(a.dateUploaded < b.dateUploaded) return 1;
    if(a.dateUploaded == b.dateUploaded) return 0;
    return -1;
  }

  deleteDocument(id: number, docName: string) {
    
    this.translateService.get([
      'project-documents-page.do-you-want-to-delete-document',
      'project-documents-page.delete',
      'project-documents-page.selected-document-deleted-successfully',
      'project-documents-page.unable-to-delete-selected-document'
    ]).subscribe((res: any) => {
      this.confirmationService.confirm({
        message: res['project-documents-page.do-you-want-to-delete-document'],
        header: res['project-documents-page.delete'] + ": " + docName + "?",
        icon: 'pi pi-info-circle',
        acceptButtonStyleClass:"p-button-danger p-button-text",
        rejectButtonStyleClass:"p-button-text p-button-text",
        acceptIcon:"none",
        rejectIcon:"none",
  
        accept: () => {
          this.ProjectDocService.deleteDocument(id).subscribe({
            next: _ => {
              this.msgPopupService.showSuccess(res['project-documents-page.selected-document-deleted-successfully']);
              this.ngOnInit();
            },
            error: error => {
              this.msgPopupService.showError(res['project-documents-page.unable-to-delete-selected-document']);
            }
          });
        },
        reject: () => {
  
        }
      })
    });
  }

  toggleOlderVersions(element: any) {
    element.showOlderVersions = !element.showOlderVersions;
  }
  
  getIcon(fileName: string): string {
    let extension = fileName.split(".")[fileName.split(".").length-1];
    return "assets/document-type-icons/icon_" + extension + ".png";

  }

  searchDocuments() {

    let searchTerm = this.searchTerm.toLowerCase().trim();
    let filteredTitles = [...this.documentTitlesBackup];
    filteredTitles = filteredTitles.filter(title => title.title.toLowerCase().includes(searchTerm));
    this.documentTitles = filteredTitles;
    this.hasDocuments = this.documentTitles.length > 0;

  }

  /**
   * Funkcija koja za prosledjeni naslov vraca isti naslov ukoliko je duzina odgovarajuca
   * U slucaju da je naslov predug naziv ce biti skracen sa dodatim ... na kraju
   */
  getTitle(current: string) {

    const LIMIT = 20;
    if (current.length < LIMIT ) return current;
    return current.substring(0, LIMIT) + "...";

  }

  downloadDocument(documentId: number, title: string) {
    this.ProjectDocService.getDocumentContents(documentId).subscribe(data => {
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
      this.translateService.get('project-documents-page.error-downloading-document').subscribe((res: string) => {
        this.msgPopupService.showError(res);
      });
    });
  }

  previewDocument(documentId: number, title: string) {
    this.ProjectDocService.getDocumentContents(documentId).subscribe(data => {
      
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
      this.translateService.get('project-documents-page.error-previewing-document').subscribe((res: string) => {
        this.msgPopupService.showError(res);
      });
      this.msgPopupService.showError('Error previewing document');
    });
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

}
