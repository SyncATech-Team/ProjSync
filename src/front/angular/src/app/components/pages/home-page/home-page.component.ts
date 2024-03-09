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
    type: "Company-managed software",
    description: "description1",
    owner: this.owner,
    icon: "",
    createdDate: new Date,
    dueDate: new Date,
    budget: 0,
    visibility: ""
  }
  project2: Project = {
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
    parent: this.project1.id
  }
  project3: Project = {
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
    parent: this.project1.id
  }
  project4: Project = {
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
    parent: this.project2.id
  }
  projects: any[] = [
        this.project1,
        this.project2,
        this.project3,
        this.project4
  ];

  toProject():void {
    
  }

  extandedRows:number[]=[];
  isRotated: boolean = false;

  toggleRow(rowID: number): void{
    let index = this.extandedRows.indexOf(rowID);
    this.isRotated = !this.isRotated;
    if(index!==-1)
    {
      this.extandedRows.splice(index, 1);
    }
    else
    {
      this.extandedRows.push(rowID);
    }
  }
  isExtanded(rowID: number):boolean{
    return this.extandedRows.includes(rowID);
  }
}
