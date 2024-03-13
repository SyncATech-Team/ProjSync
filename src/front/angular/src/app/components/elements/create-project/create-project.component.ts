import { Component, OnInit } from '@angular/core';
import { HomePageComponent } from '../../pages/home-page/home-page.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.css',
  providers: [DatePipe]
})
export class CreateProjectComponent implements OnInit{

  constructor(private homePage: HomePageComponent,private datePipe:DatePipe) {}

  ngOnInit(): void {
    
  }
  project: any={
      id:0,
      name: "",
      key: "",
      type: "",
      description: "",
      owner: "",
      icon: "",
      createdDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      dueDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      budget: 0,
      visibility: "",
      parent: "",
      isExtanded: false,
      isFavorite: false,
      subProjects:[]
    }
  
  projects: any[]=this.homePage.projects;
  
  projectVisibility: string[] = ["private","public"]; 

  create():void{
    this.homePage.projects.push(this.project);
    console.log(this.project);
  }
}
