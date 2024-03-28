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
  selector: 'app-filter-project',
  templateUrl: './filter-project.component.html',
  styleUrl: './filter-project.component.css'
})
export class FilterProjectComponent implements OnInit{

  @ViewChild('filterProjectForm') formRecipe?: NgForm; 

  projectTypes: ProjectType []=[];

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
  }

  projects: Project[]=[];

  constructor(private projectVisibilityService: ProjectVisibilityService, private projectTypeService: ProjectTypeService, private userService: UserService,
    private homePage: HomePageComponent,private projectService: ProjectService, private accountServis: AccountService, private msgPopUpService: MessagePopupService,
    private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {

    this.projectTypeService.getAllProjectTypes().subscribe({
      next: (response)=>{
        this.projectTypes = response;
      },
      error: (error)=>{
        console.log(error);
      }
    });
  }

  initializeFilters():void {
    this.projects=this.homePage.projects;
    console.log(this.projects);
  }

  onSuccessfulCreation(){
    this.formRecipe?.reset();
    this.changeDetectorRef.detectChanges();
  }

  applyFilters(){
    
  }


}
