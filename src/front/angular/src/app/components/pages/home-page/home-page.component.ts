import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../_service/account.service';
import { Router } from '@angular/router';
import { User } from '../../../_models/user';
import { Project } from '../../../_models/project.model';
import { ProjectService } from '../../../_service/project.service';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {

  constructor(public accoutService: AccountService,private projectService:ProjectService) { }
  projects2: Project[]=[];
  ngOnInit(): void {
    this.projectService.getAllProjects().subscribe({
      next: (response) => {
        this.projects2 = response;
      },
      error: (error) => {
        console.log(error);
      }
    });
    this.projects.forEach((project)=>{
      project.subProjects = this.projects.filter((subproject)=>  subproject.parent == project.id );
    });
    this.filterProjects('private');
  }

  
  owner: User = {
    username: "User1",
    token: ""
  };
  owner2: User = {
    username: "User2",
    token: ""
  };
  project1: any = {
    id:0,
    name: "project1",
    key: "er",
    type: "Company-managed software1",
    description: "description1",
    owner: this.owner.username,
    icon: "",
    createdDate: new Date,
    dueDate: new Date,
    budget: 0,
    visibility: "private",
    isExtanded: false,
    isFavorite: false
  }
  project2: any = {
    id:1,
    name: "project2",
    key: "ty",
    type: "Company-managed software2",
    description: "description1",
    owner: this.owner.username,
    icon: "",
    createdDate: new Date,
    dueDate: new Date,
    budget: 0,
    visibility: "private",
    parent: this.project1.id,
    isExtanded: false,
    isFavorite: false
  }
  project3: any = {
    id:2,
    name: "project3",
    key: "ps",
    type: "Company-managed software3",
    description: "description3",
    owner: this.owner2.username,
    icon: "",
    createdDate: new Date,
    dueDate: new Date,
    budget: 0,
    visibility: "public",
    parent: this.project1.id,
    isExtanded: false,
    isFavorite: false
  }
  project4: any = {
    id:3,
    name: "project4",
    key: "pt",
    type: "Company-managed software4",
    description: "description1",
    owner: this.owner2.username,
    icon: "",
    createdDate: new Date,
    dueDate: new Date,
    budget: 0,
    visibility: "public",
    parent: this.project2.id,
    isExtanded: false,
    isFavorite: true
  }
  project5: any = {
    id:4,
    name: "project21",
    key: "er",
    type: "Company-managed software1",
    description: "description1",
    owner: this.owner.username,
    icon: "",
    createdDate: new Date,
    dueDate: new Date,
    budget: 0,
    visibility: "private",
    isExtanded: false,
    isFavorite: false
  }
  project6: any = {
    id:5,
    name: "project22",
    key: "ty",
    type: "Company-managed software2",
    description: "description1",
    owner: this.owner.username,
    icon: "",
    createdDate: new Date,
    dueDate: new Date,
    budget: 0,
    visibility: "private",
    parent: this.project1.id,
    isExtanded: false,
    isFavorite: false
  }
  project7: any = {
    id:6,
    name: "project23",
    key: "ps",
    type: "Company-managed software3",
    description: "description3",
    owner: this.owner2.username,
    icon: "",
    createdDate: new Date,
    dueDate: new Date,
    budget: 0,
    visibility: "public",
    parent: this.project1.id,
    isExtanded: false,
    isFavorite: false
  }
  project8: any = {
    id:7,
    name: "project24",
    key: "pt",
    type: "Company-managed software4",
    description: "description1",
    owner: this.owner2.username,
    icon: "",
    createdDate: new Date,
    dueDate: new Date,
    budget: 0,
    visibility: "public",
    parent: this.project2.id,
    isExtanded: false,
    isFavorite: true
  }
  project9: any = {
    id:8,
    name: "project31",
    key: "er",
    type: "Company-managed software1",
    description: "description1",
    owner: this.owner.username,
    icon: "",
    createdDate: new Date,
    dueDate: new Date,
    budget: 0,
    visibility: "private",
    isExtanded: false,
    isFavorite: false
  }
  project10: any = {
    id:9,
    name: "project32",
    key: "ty",
    type: "Company-managed software2",
    description: "description1",
    owner: this.owner.username,
    icon: "",
    createdDate: new Date,
    dueDate: new Date,
    budget: 0,
    visibility: "private",
    parent: this.project1.id,
    isExtanded: false,
    isFavorite: false
  }
  project11: any = {
    id:10,
    name: "project33",
    key: "ps",
    type: "Company-managed software3",
    description: "description3",
    owner: this.owner2.username,
    icon: "",
    createdDate: new Date,
    dueDate: new Date,
    budget: 0,
    visibility: "public",
    parent: this.project1.id,
    isExtanded: false,
    isFavorite: false
  }
  project12: any = {
    id:11,
    name: "project34",
    key: "pt",
    type: "Company-managed software4",
    description: "description1",
    owner: this.owner2.username,
    icon: "",
    createdDate: new Date,
    dueDate: new Date,
    budget: 0,
    visibility: "public",
    parent: this.project2.id,
    isExtanded: false,
    isFavorite: true
  }
  project13: any = {
    id:12,
    name: "project41",
    key: "er",
    type: "Company-managed software1",
    description: "description1",
    owner: this.owner.username,
    icon: "",
    createdDate: new Date,
    dueDate: new Date,
    budget: 0,
    visibility: "private",
    isExtanded: false,
    isFavorite: false
  }
  project14: any = {
    id:13,
    name: "project42",
    key: "ty",
    type: "Company-managed software2",
    description: "description1",
    owner: this.owner.username,
    icon: "",
    createdDate: new Date,
    dueDate: new Date,
    budget: 0,
    visibility: "private",
    parent: this.project1.id,
    isExtanded: false,
    isFavorite: false
  }
  project15: any = {
    id:14,
    name: "project43",
    key: "ps",
    type: "Company-managed software3",
    description: "description3",
    owner: this.owner2.username,
    icon: "",
    createdDate: new Date,
    dueDate: new Date,
    budget: 0,
    visibility: "public",
    parent: this.project1.id,
    isExtanded: false,
    isFavorite: false
  }
  project16: any = {
    id:15,
    name: "project44",
    key: "pt",
    type: "Company-managed software4",
    description: "description1",
    owner: this.owner2.username,
    icon: "",
    createdDate: new Date,
    dueDate: new Date,
    budget: 0,
    visibility: "public",
    parent: this.project2.id,
    isExtanded: false,
    isFavorite: true
  }
  projects: any[] = [
        this.project1,
        this.project2,
        this.project3,
        this.project4,
        this.project5,
        this.project6,
        this.project7,
        this.project8,
        this.project9,
        this.project10,
        this.project11,
        this.project12,
        this.project13,
        this.project14,
        this.project15,
        this.project16
  ];
  
  toProject():void {
    
  }

  toggleRow(project: any): void{
    project.isExtanded = !project.isExtanded;
  }

  sortedColumn: string = '';
  isAscending: boolean = true;
  projectsShow: any[] = [];

  sortData(column: string) {
    if (this.sortedColumn === column) {
      this.isAscending = !this.isAscending;
    } else {
      this.sortedColumn = column;
      this.isAscending = true;
    }

    this.projectsShow.sort((a, b) => {
      const direction = this.isAscending ? 1 : -1;
      if (a[column] < b[column]) return -1 * direction;
      if (a[column] > b[column]) return 1 * direction;
      return 0;
    });
  }

  filterProjects(filter :string ):void {
    if(filter=="stared")
    {
      this.projectsShow=this.projects.filter((project)=> project.isFavorite);
    }
    else{
      if(filter=="private")
      {
        this.projectsShow=this.projects.filter((project)=> project.visibility===filter);
      }
      else
      {
        this.projectsShow=this.projects.filter((project)=> project.visibility===filter);
      }
    }
  }
  
}
