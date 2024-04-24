import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../../../_models/project.model';
import { ProjectService } from '../../../../_service/project.service';

@Component({
  selector: 'app-project-summary-page',
  templateUrl: './project-summary-page.component.html',
  styleUrl: './project-summary-page.component.css'
})
export class ProjectSummaryPageComponent implements OnInit{
  projectName: string | null = '';
  projectType: string = '';
  projectKey: string = '';
  isLoading: boolean = true;
  projectImageSource : string = "";
  defaultImagePath : string = "../../../../../assets/project-icon/default_project_image.png";

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

  constructor (private route: ActivatedRoute,private projectService: ProjectService){
    this.projectName = route.snapshot.paramMap.get('projectName');
  }
  ngOnInit(): void {
    this.projectService.getProjectByName(this.projectName).subscribe({
      next: (response)=>{
        this.project= response;
        this.projectType = this.project.typeName;
        this.projectKey = this.project.key;
        this.projectImageSource = this.project.icon!;
        this.isLoading = false; 
      },
      error: (error)=>{
        console.log(error);
      }
    });

  }

  getDefaultImagePath(): string {
    // let x: number = this.getRandomInteger(1, 10);
    let x: number = 1;
    let path: string = "../../../../../assets/images/DefaultAccountProfileImages/default_account_image_" + x + ".png";
    
    // console.log(path);

    return path;
  }
}
