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
import { TranslateService } from '@ngx-translate/core';


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
    visibilityName: "Public",
  }

  projects: Project[]=[];

  constructor(private projectVisibilityService: ProjectVisibilityService, private projectTypeService: ProjectTypeService, private userService: UserService,
    private homePage: HomePageComponent,private projectService: ProjectService, private accountServis: AccountService, private msgPopUpService: MessagePopupService,
    private changeDetectorRef: ChangeDetectorRef,
    private translateService: TranslateService
  ) {}

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
      this.translateService.get('create-project-notification.project-name-empty').subscribe((res: string) => {
        this.msgPopUpService.showError(res);
      });
      return; 
    }
    else if(this.creationModel.key == ""){
      this.translateService.get('create-project-notification.project-key-empty').subscribe((res: string) => {
        this.msgPopUpService.showError(res);
      });
      return;
    }
    else if(this.creationModel.typeName == ""){
      this.translateService.get('create-project-notification.project-type-empty').subscribe((res: string) => {
        this.msgPopUpService.showError(res);
      });
      return;
    }
    else if(this.creationModel.creationDate == null){
      this.translateService.get('create-project-notification.project-start-date-empty').subscribe((res: string) => {
        this.msgPopUpService.showError(res);
      });
      return;
    }
    else if(this.creationModel.dueDate == null){
      this.translateService.get('create-project-notification.project-due-date-empty').subscribe((res: string) => {
        this.msgPopUpService.showError(res);
      });
      return;
    }

    if(this.creationModel.dueDate < this.creationModel.creationDate){
      this.translateService.get('create-project-notification.due-date-before-start-date').subscribe((res: string) => {
        this.msgPopUpService.showError(res);
      });
      return;
    }
    else if(DueDateFormated < this.currentDate){
      this.translateService.get('create-project-notification.due-date-before-today').subscribe((res: string) => {
        this.msgPopUpService.showError(res);
      });
      return;
    }
    else if(this.currentUser == ''){
      this.translateService.get('create-project-notification.user-not-found').subscribe((res: string) => {
        this.msgPopUpService.showError(res);
      });
      return;
    }
    else{
      this.projectService.createProject(this.creationModel).subscribe({
        next: (response)=>{
          this.homePage.initializeProjects();
          this.translateService.get('create-project-notification.project-created').subscribe((res: string) => {
            this.msgPopUpService.showSuccess(res);
          });
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
