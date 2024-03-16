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
  projects: Project[]=[];
  ngOnInit(): void {
    this.projectService.getAllProjects().subscribe({
      next: (response) => {
        this.projects = response;
        this.projects.forEach((project)=>{
          project.subProjects = this.projects.filter((subproject)=>  subproject.parentId == project.id );
          project.isExtanded = false;
          project.isFavorite = false;
          this.filterProjects('private');
        });
        console.log(this.projects);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  
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
        this.projectsShow=this.projects.filter((project)=> project.visibilityId===1);
      }
      else
      {
        this.projectsShow=this.projects.filter((project)=> project.visibilityId===2);
      }
    }
  }
  
}
