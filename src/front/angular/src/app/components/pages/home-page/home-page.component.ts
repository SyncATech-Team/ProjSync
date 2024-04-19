import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../_service/account.service';
import { Project } from '../../../_models/project.model';
import { ProjectService } from '../../../_service/project.service';
import { ProjectTypeService } from '../../../_service/project-type.service';
import { ProjectType } from '../../../_models/project-type';
import { CompanyroleService } from '../../../_service/companyrole.service';
import { TableLazyLoadEvent } from 'primeng/table';



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
  totalRecords = 0;

  permitions: any;

  selectedColumns!: string[];
  columns!: string[];
  showColumns!: string[];

  constructor(public accoutService: AccountService,private projectService:ProjectService ,private projectTypes:ProjectTypeService,private companyroleService: CompanyroleService) { }

  ngOnInit(): void {
    this.columns = ['Key','Type','Description','Owner','Creation Date','Due Date','Budget','Progress'];
    this.selectedColumns = ['Key','Type','Owner','Creation Date','Due Date','Progress'];
    this.showColumns = ['Name',...this.selectedColumns];
    //this.initializeProjects();
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
    var user = this.accoutService.getCurrentUser();
    if(user?.username)
    {
      this.projectService.getAllProjectsForUser(user.username).subscribe({
        next: (response) => {
          this.projects = response;
          this.projects.forEach((project)=>{ 
            project.isExtanded = false;
            project.isFavorite = false;
            project.creationDate = new Date(project.creationDate);
            project.dueDate = new Date(project.dueDate); 
          });
          this.totalRecords=this.projects.length;
          this.filterProjects(this.visibilityFilter);
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
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

  MAX_PROJECT_NAME_LENGTH_DISPLAY = 20;
  getProjectName(projectName: string): string {

    let s: string = "";
    if(projectName.length > this.MAX_PROJECT_NAME_LENGTH_DISPLAY)
      s = projectName.substring(0, this.MAX_PROJECT_NAME_LENGTH_DISPLAY) + "...";
    else
      s = projectName;

    return s;
  }

  onSelectedChange(){
    this.selectedColumns.forEach(item => {
      if(!this.showColumns.includes(item)){
        this.showColumns.push(item);
      }
    });
    this.showColumns.forEach((item,index) => {
      if(!this.selectedColumns.includes(item) && item!=='Name' && item !==''){
        this.showColumns.splice(index,1);
      }
    })
  }

  loadProjects(event: TableLazyLoadEvent){
    
    var user = this.accoutService.getCurrentUser();

    if(user?.username )
    {
      this.projectService.getPaginationAllProjectsForUser(user.username,event).subscribe({
        next: (response) => {
          this.projects = response.projects;
          this.totalRecords = response.numberOfRecords;
          this.projects.forEach((project)=>{ 
            project.isExtanded = false;
            project.isFavorite = false;
            project.creationDate = new Date(project.creationDate);
            project.dueDate = new Date(project.dueDate);
          });
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }
}
