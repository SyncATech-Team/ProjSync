import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../_service/account.service';
import { Project } from '../../../_models/project.model';
import { ProjectService } from '../../../_service/project.service';
import { ProjectTypeService } from '../../../_service/project-type.service';
import { ProjectType } from '../../../_models/project-type';
import { CompanyroleService } from '../../../_service/companyrole.service';



@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {

  projects: Project[]=[];
  Types: any[]=[];

  projectsShow: any[] = [];

  searchTerm: string = '';
  
  visibilityFilter: string = 'private';
  first = 0;
  rows = 10;

  permitions: any;

  constructor(public accoutService: AccountService,private projectService:ProjectService ,private projectTypes:ProjectTypeService,private companyroleService: CompanyroleService) { }

  ngOnInit(): void {
    this.initializeProjects();
    this.projectTypes.getAllProjectTypes().subscribe({
      next: (response: ProjectType[]) =>{
        this.Types = response.map(item => item.name);
      }
    });
    
    var user = this.accoutService.getCurrentUser();
    if(user?.permitions)
      this.permitions = user.permitions;
    this.filterProjects('public');
  }

  initializeProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (response) => {
        this.projects = response;
        this.projects.forEach((project)=>{ 
          project.isExtanded = false;
          project.isFavorite = false;
          project.creationDate = new Date(project.creationDate);
          project.dueDate = new Date(project.dueDate); 
        });
        this.filterProjects(this.visibilityFilter);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  
  filterProjects(filter :string ):void {
    this.visibilityFilter = filter;
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
        project.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || project.key.toLowerCase().includes(this.searchTerm.toLowerCase())
        || project.ownerUsername.toLowerCase().includes(this.searchTerm.toLowerCase()) || project.typeName.toLowerCase().includes(this.searchTerm.toLowerCase()) 
    );
  }
  getDefaultImagePath(): string {
    // let x: number = this.getRandomInteger(1, 10);
    let x: number = 1;
    let path: string = ".././../../../assets/images/DefaultAccountProfileImages/default_account_image_" + x + ".png";
    
    // console.log(path);

    return path;
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  test(tst : any){
    console.log(tst);
  }
}
