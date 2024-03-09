import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../_service/account.service';
import { Router } from '@angular/router';
import { User } from '../../../_models/user';
import { Project } from '../../../_models/project.model';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {

  constructor(public accoutService: AccountService) { }

  ngOnInit(): void {
    
  }
  owner: User = {
    username: "User1",
    token: ""
  };
  project1: Project = {
    id:0,
    name: "project1",
    key: "p1",
    type: "type1",
    description: "description1",
    owner: this.owner,
    icon: "",
    createdDate: new Date,
    dueDate: new Date,
    budget: 0,
    visibility: ""
  }
  project2: Project = {
    id:0,
    name: "project2",
    key: "p2",
    type: "type2",
    description: "description1",
    owner: this.owner,
    icon: "",
    createdDate: new Date,
    dueDate: new Date,
    budget: 0,
    visibility: "",
    parent: this.project1
  }
  project3: Project = {
    id:0,
    name: "project3",
    key: "p3",
    type: "type3",
    description: "description3",
    owner: this.owner,
    icon: "",
    createdDate: new Date,
    dueDate: new Date,
    budget: 0,
    visibility: "",
    parent: this.project1
  }
  project4: Project = {
    id:0,
    name: "project4",
    key: "p4",
    type: "type4",
    description: "description1",
    owner: this.owner,
    icon: "",
    createdDate: new Date,
    dueDate: new Date,
    budget: 0,
    visibility: "",
    parent: this.project2
  }
  projects: any[] = [
        this.project1,
        this.project2,
        this.project3,
        this.project4
  ];

  toProject():void {
    
  }
}
