import { Component, OnInit, ViewChild } from '@angular/core';
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
import { AccountService } from '../../../_service/account.service';
import { ChangeDetectorRef } from '@angular/core';
import { MessagePopupService } from '../../../_service/message-popup.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.css',
  providers: [DatePipe]
})
export class CreateProjectComponent implements OnInit{

  @ViewChild('createProjectForm') formRecipe?: NgForm; 
  
  currentDate = new Date();
  currentUser = '';
  users: UserGetter []= [];
  projectTypes: ProjectType []=[];
  projectVisibilities: ProjectVisibility[]=[];

  creationModel: Project = {
    name: "",
    key: "",
    typeName: "",
    description: "",
    ownerUsername: "",
    creationDate: null!, 
    dueDate: null!,
    budget: 0,
    visibilityName: "",
  }

  projects: Project[]=[];

  constructor(private projectVisibilityService: ProjectVisibilityService, private projectTypeService: ProjectTypeService, private userService: UserService,
    private homePage: HomePageComponent,private projectService: ProjectService, private accountServis: AccountService, private msgPopUpService: MessagePopupService,
    private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {

    // Pronalazenje trenutnog usera
    var user = this.accountServis.getCurrentUser();
    this.currentUser = user?.username!;

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

  onSuccessfulCreation(){
    this.formRecipe?.reset();
    this.changeDetectorRef.detectChanges();
   }

  create():void{
    var DueDateFormated = new Date(this.creationModel.dueDate);
    this.creationModel.ownerUsername = this.currentUser;

    if(this.creationModel.name == ""){
      this.msgPopUpService.showError("Unable to create project, project name is empty");
      return; 
    }
    else if(this.creationModel.typeName == ""){
      this.msgPopUpService.showError("Unable to create project, project type is empty");
      return;
    }
    else if(this.creationModel.visibilityName == ""){
      this.msgPopUpService.showError("Unable to create project, visibility name is empty");
      return;
    }
    else if(this.creationModel.creationDate == null){
      this.msgPopUpService.showError("Unable to create project, creation date is not set");
      return;
    }
    else if(this.creationModel.dueDate == null){
      this.msgPopUpService.showError("Unable to create project, due date is not set");
      return;
    }

    if(this.creationModel.dueDate < this.creationModel.creationDate){
      this.msgPopUpService.showError("Unable to create project, due date is before creation date");
    }
    else if(DueDateFormated < this.currentDate){
      this.msgPopUpService.showError("Unable to create project, due date is before current date");
    }
    else if(this.currentUser == ''){
      this.msgPopUpService.showError("Unable to create project, user not found");
    }
    else{
      this.projectService.createProject(this.creationModel).subscribe({
        next: (response)=>{
          this.homePage.initializeProjects();
          this.msgPopUpService.showSuccess("Project successfully created");
          this.onSuccessfulCreation();
          // this.formCreateProject.reset();
        },
        error: (error)=>{
          this.msgPopUpService.showError(error.error.message);
          // this.msgPopUpService.showError("Unable to create project. Some fields are empty.");
        }
      });
    }
  }



}
