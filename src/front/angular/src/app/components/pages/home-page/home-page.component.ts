import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../_service/account.service';
import { Router } from '@angular/router';
import { User } from '../../../_models/user';
import { Project } from '../../../_models/project.model';
import { Observable } from 'rxjs';
import { Sort,MatSortModule } from '@angular/material/sort';

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

    this.sortedData=this.projects.slice();
  }
  owner: User = {
    username: "User1",
    token: ""
  };
  project1: any = {
    id:0,
    name: "project1",
    key: "er",
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
    key: "ty",
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
    key: "ps",
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
    key: "pt",
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
  sortedData: any[]=[];
  
  toProject():void {
    
  }

  toggleRow(project: any): void{
    project.isExtanded = !project.isExtanded;
  }

  sortData(sort: Sort) {
    const data = this.projects.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return this.compare(a.name, b.name, isAsc);
        case 'key':
          return this.compare(a.key, b.key, isAsc);
        case 'type':
          return this.compare(a.type, b.type, isAsc);
        case 'lead':
          return this.compare(a.owner.username, b.owner.username, isAsc);
        case 'stared':
          return this.compare(Number(a.isFavorite), Number(b.isFavorite), isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
