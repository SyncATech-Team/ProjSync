import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-project-documents-page',
  templateUrl: './project-documents-page.component.html',
  styleUrl: './project-documents-page.component.css'
})
export class ProjectDocumentsPageComponent implements OnInit{

  projectName: string = '';
  documentTitles: DocumentTitle[] = [];

  constructor (
    private ProjectDocService: ProjectDocumentService,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private router:Router,
    private msgPopupService: MessagePopupService,
    private formBuilder: FormBuilder,
    private projectTypeService: ProjectTypeService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService){

      this.projectName = route.snapshot.paramMap.get('projectName')!;
    
    };

  ngOnInit(): void {
    this.ProjectDocService.getDocumentTitles(this.projectName).subscribe({
      next: response => {
        this.documentTitles = response.reverse();
      },
      error: error => {
        console.log(error.error);
      }
    })
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
        this.ProjectDocService.deleteDocument(id).subscribe({
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
    })
  }

  toggleOlderVersions(element: any) {
    element.showOlderVersions = !element.showOlderVersions;
  }
  
  getIcon(fileName: string): string {
    let extension = fileName.split(".")[fileName.split(".").length-1];
    return "assets/document-type-icons/icon_" + extension + ".png";

  }

}
