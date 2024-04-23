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

@Component({
  selector: 'app-project-documents-page',
  templateUrl: './project-documents-page.component.html',
  styleUrl: './project-documents-page.component.css'
})
export class ProjectDocumentsPageComponent implements OnInit{

  form : FormGroup;
  projectName: string | null = '';
  fileName: String | null = '';

  projectTypes: ProjectType []=[];
  
  project: Project = {
    name: "",
    key: "",
    typeName: "",
    description: "",
    ownerUsername: "",
    creationDate: new Date(), 
    dueDate: new Date(),
    budget: 0,
    visibilityName: ""
  }
  
  uploadBarValue: number = 0;
  showUploadProgressBar: boolean = false;

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
      this.projectName = route.snapshot.paramMap.get('projectName');
      this.form = this.formBuilder.group({
        name: [''],
        category: [''],
        description: ['']
      });
  
      this.projectTypeService.getAllProjectTypes().subscribe({
        next: (response)=>{
          this.projectTypes = response;
        },
        error: (error)=>{
          console.log(error);
        }
      });};



  ngOnInit(): void {
    this.projectService.getProjectByName(this.projectName).subscribe({
      next: (response)=>{
        this.project= response;

        //Za ispis u input poljima default-no
        // this.projectName2 = this.project.name;
        // this.projectType2 = this.project.typeName;
        // this.projectDescription2 = this.project.description;

        this.form.patchValue({
          category: this.projectTypes.find(type => type.name === this.project.typeName)
        });
      },
      error: (error)=>{
        console.log(error);
      }
    });
  }

  onFileSelected(event: any){
    const files: FileList = event.target.files;
    const filesArray: File[] = Array.from(files); // Convert FileList to array

    this.showUploadProgressBar = true;
    this.ProjectDocService.uploadDocument(this.projectName!, filesArray).subscribe({
      next: response => {
        this.showUploadProgressBar = false;
        this.msgPopupService.showSuccess("Files successfully uploaded.");
      },
      error: error => {
        this.msgPopupService.showError("Files not uploaded. Try again.");
      }
    });
  }

}
