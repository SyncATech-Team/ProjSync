import { Component, OnInit } from '@angular/core';
import { Project } from '../../../../_models/project.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../../_service/project.service';
import { MessagePopupService } from '../../../../_service/message-popup.service';

@Component({
  selector: 'app-project-settings-page',
  templateUrl: './project-settings-page.component.html',
  styleUrl: './project-settings-page.component.css'
})
export class ProjectSettingsPageComponent implements OnInit {
  
  projectName: string | null = '';
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

  constructor (private route: ActivatedRoute,private projectService: ProjectService,private router:Router,private msgPopupService: MessagePopupService){
    this.projectName = route.snapshot.paramMap.get('projectName');
  }

  ngOnInit(): void {
    this.projectService.getProjectByName(this.projectName).subscribe({
      next: (response)=>{
        this.project= response;
      },
      error: (error)=>{
        console.log(error);
      }
    });
  }

  update(){
    if(this.projectName && this.projectName!=this.project.name)
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
    })
  }
}
