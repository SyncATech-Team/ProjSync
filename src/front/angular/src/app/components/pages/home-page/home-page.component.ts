import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../_service/account.service';
import { Router } from '@angular/router';
import { User } from '../../../_models/user';
import { Project } from '../../../_models/project.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {

  constructor(public accoutService: AccountService) { }

  ngOnInit(): void {
    this.projects.forEach((project)=>{
      project.subProjects = this.projects.filter((subproject)=>  subproject.parent == project.id );
    });
  }
  owner: User = {
    username: "User1",
    token: ""
  };
  project1: any = {
    id:0,
    name: "project1",
    key: "p1",
    type: "Company-managed software",
    description: "description1",
    owner: this.owner,
    icon: "",
    createdDate: new Date,
    dueDate: new Date,
    budget: 0,
    visibility: "",
    isExtanded: false,
    isFavorite: false
  }
  project2: any = {
    id:1,
    name: "project2",
    key: "p2",
    type: "Company-managed software",
    description: "description1",
    owner: this.owner,
    icon: "",
    createdDate: new Date,
    dueDate: new Date,
    budget: 0,
    visibility: "",
    parent: this.project1.id,
    isExtanded: false,
    isFavorite: false
  }
  project3: any = {
    id:2,
    name: "project3",
    key: "p3",
    type: "Company-managed software",
    description: "description3",
    owner: this.owner,
    icon: "",
    createdDate: new Date,
    dueDate: new Date,
    budget: 0,
    visibility: "",
    parent: this.project1.id,
    isExtanded: false,
    isFavorite: false
  }
  project4: any = {
    id:3,
    name: "project4",
    key: "p4",
    type: "Company-managed software",
    description: "description1",
    owner: this.owner,
    icon: "",
    createdDate: new Date,
    dueDate: new Date,
    budget: 0,
    visibility: "",
    parent: this.project2.id,
    isExtanded: false,
    isFavorite: true
  }
  projects: any[] = [
        this.project1,
        this.project2,
        this.project3,
        this.project4
  ];

  toProject():void {
    
  }

  toggleRow(project: any): void{
    project.isExtanded = !project.isExtanded;
  }
}
