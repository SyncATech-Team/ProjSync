import { Component, OnInit } from '@angular/core';
import { Project } from '../../../../_models/project.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../../_service/project.service';
import { MessagePopupService } from '../../../../_service/message-popup.service';
import { FormBuilder, FormGroup} from '@angular/forms';
import { ProjectType } from '../../../../_models/project-type';
import { ProjectTypeService } from '../../../../_service/project-type.service';

@Component({
  selector: 'app-project-settings-page',
  templateUrl: './project-settings-page.component.html',
  styleUrl: './project-settings-page.component.css'
})
export class ProjectSettingsPageComponent implements OnInit {
  
  form : FormGroup;
  projectName: string | null = '';

  //Za ispis u input poljima default-no
  projectName2: string | null = '';
  projectType2: string | null = '';
  projectDescription2: string | null = '';

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

  constructor (
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private router:Router,
    private msgPopupService: MessagePopupService,
    private formBuilder: FormBuilder,
    private projectTypeService: ProjectTypeService){
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
    });
  }

  ngOnInit(): void {
    this.projectService.getProjectByName(this.projectName).subscribe({
      next: (response)=>{
        this.project= response;

        //Za ispis u input poljima default-no
        this.projectName2 = this.project.name;
        this.projectType2 = this.project.typeName;
        this.projectDescription2 = this.project.description;

        this.form.patchValue({
          category: this.projectTypes.find(type => type.name === this.project.typeName)
        });
      },
      error: (error)=>{
        console.log(error);
      }
    });
  }

  onSubmit() {
    this.project.name = this.form.value.name;
    this.project.description = this.form.value.description;
    this.project.typeName = this.form.value.category.name;
    
    if(this.projectName){
      if(this.projectName!=this.project.name || this.form.value.description != this.project.description || this.form.value.category.name != this.project.typeName){
        this.projectService.updateProject(this.projectName,this.project).subscribe({
          next:(response)=>{
              this.router.navigate(["home/projects/settings/"+this.project.name]);
              this.projectName=this.project.name;
              this.msgPopupService.showSuccess("Project name updated");
            },
            error: (error)=>{
              console.log(error);
              this.msgPopupService.showError("Project name failed to update");
            }
          });
      }
    }
  }
}
