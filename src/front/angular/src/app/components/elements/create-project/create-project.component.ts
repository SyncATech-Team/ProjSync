import { Component, OnInit } from '@angular/core';
import { HomePageComponent } from '../../pages/home-page/home-page.component';
import { DatePipe } from '@angular/common';
import { ProjectService } from '../../../_service/project.service';
import { Project } from '../../../_models/project.model';
import { AccountService } from '../../../_service/account.service';
import { UserGetter } from '../../../_models/user-getter';
import { ProjectType } from '../../../_models/project-type';
import { ProjectTypeService } from '../../../_service/project-type.service';
import { ProjectVisibility } from '../../../_models/project-visibility';
import { ProjectVisibilityService } from '../../../_service/project-visibility.service';


@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.css',
  providers: [DatePipe]
})
export class CreateProjectComponent implements OnInit{

  constructor(private projectVisibilityService: ProjectVisibilityService, private projectTypeService: ProjectTypeService, private accountService: AccountService,
    private homePage: HomePageComponent,private datePipe:DatePipe,private projectService: ProjectService) {}

  users: UserGetter []= [];
  projectTypes: ProjectType []=[];
  projectVisibilities: ProjectVisibility[]=[];

  ngOnInit(): void {
    this.accountService.getAllUsers().subscribe({
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
  creationModel: Project = {
      id: 0,
      name: "",
      key: "",
      typeId: 0,
      description: "",
      ownerId: 0,
      creationDate: new Date(), 
      dueDate: new Date(),
      budget: 0,
      visibilityId: 0,
      parentId: null
    }
  
  projects: Project[]=[];

  initializeProjects():void {
    this.projects=this.homePage.projects;
  }

  create():void{
    console.log(this.creationModel);
    this.projectService.createProject(this.creationModel).subscribe({
      next: (response)=>{
        this.homePage.ngOnInit();
      },
      error: (error)=>{
        console.log(error);
      }
    });
  }
}
