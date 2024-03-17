import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../_service/account.service';
import { Project } from '../../../_models/project.model';
import { ProjectService } from '../../../_service/project.service';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {

  projects: Project[]=[];
  
  sortedColumn: string = '';
  isAscending: boolean = true;
  projectsShow: any[] = [];

  searchTerm: string = '';

  constructor(public accoutService: AccountService,private projectService:ProjectService) { }

  ngOnInit(): void {
    this.projectService.getAllProjects().subscribe({
      next: (response) => {
        this.projects = response;
        console.log(this.projects);
        this.projects.forEach((project)=>{
          project.subProjects = this.projects.filter((subproject)=>  subproject.parentProjectName == project.name );
          project.isExtanded = false;
          project.isFavorite = false;
          this.filterProjects('private');

          console.log(project);
        });
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  
  toProject():void {
    alert("TO DO");
  }

  toggleRow(project: any): void{
    project.isExtanded = !project.isExtanded;
  }

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
        this.projectsShow=this.projects.filter((project)=> project.visibilityName==="Private");
      }
      else
      {
        this.projectsShow=this.projects.filter((project)=> project.visibilityName==="Public");
      }
    }
  }

  //Search po nazivu projekta dodat
  filterProjectsByName() {
    let x = document.getElementById("table-container");
    if(x != null){
      x.innerHTML = "";
    }

    this.projectsShow = this.projects.filter(project =>
        project.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
}
  
}
