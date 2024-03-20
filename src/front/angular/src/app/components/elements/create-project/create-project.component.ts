import { Component, OnInit } from '@angular/core';
import { HomePageComponent } from '../../pages/home-page/home-page.component';
import { DatePipe } from '@angular/common';
import { ProjectService } from '../../../_service/project.service';
import { Project } from '../../../_models/project.model';
import { UserGetter } from '../../../_models/user-getter';
import { ProjectType } from '../../../_models/project-type';
import { ProjectTypeService } from '../../../_service/project-type.service';
import { ProjectVisibility } from '../../../_models/project-visibility';
import { ProjectVisibilityService } from '../../../_service/project-visibility.service';
import { UserService } from '../../../_service/user.service';


@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.css',
  providers: [DatePipe]
})
export class CreateProjectComponent implements OnInit{

  users: UserGetter []= [];
  projectTypes: ProjectType []=[];
  projectVisibilities: ProjectVisibility[]=[];

  creationModel: Project = {
    name: "",
    key: "",
    typeName: "",
    description: "",
    ownerUsername: "",
    creationDate: new Date(), 
    dueDate: new Date(),
    budget: 0,
    visibilityName: "",
    parentProjectName: null
  }

  projects: Project[]=[];

  constructor(private projectVisibilityService: ProjectVisibilityService, private projectTypeService: ProjectTypeService, private userService: UserService,
    private homePage: HomePageComponent,private datePipe:DatePipe,private projectService: ProjectService) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (response)=>{
        this.users=response;
      },
      error: (error)=>{
        console.log(error);
      }
    });

    this.projectTypeService.getAllProjectTypes().subscribe({
      next: (response)=>{
        this.projectTypes = response;
      },
      error: (error)=>{
        console.log(error);
      }
    });

    this.projectVisibilityService.getAllProjectVisibilities().subscribe({
      next: (response)=>{
        this.projectVisibilities = response;
      },
      error: (error)=>{
        console.log(error);
      }
    });
  }

  initializeProjects():void {
    this.projects=this.homePage.projects;
  }

  create():void{
    console.log(this.creationModel);
    this.projectService.createProject(this.creationModel).subscribe({
      next: (response)=>{
        this.homePage.initializeProjects();
      },
      error: (error)=>{
        console.log(error);
      }
    });
  }
}
