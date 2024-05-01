import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../_service/account.service';
import { Project } from '../../../_models/project.model';
import { ProjectService } from '../../../_service/project.service';
import { ProjectTypeService } from '../../../_service/project-type.service';
import { ProjectType } from '../../../_models/project-type';
import { CompanyroleService } from '../../../_service/companyrole.service';
import { UserService } from '../../../_service/user.service';
import { UserGetter } from '../../../_models/user-getter';
import { PhotoForUser } from '../../../_models/photo-for-user';
import { UserProfilePicture } from '../../../_service/userProfilePicture.service';
import { IssueService } from '../../../_service/issue.service';
import { IssueModel } from '../../../_models/model-issue.model';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  projectImageSource : string = "";
  defaultImagePath : string = "../../../../assets/project-icon/default_project_image.png";
  projectCompletionMap: Map<string, number> = new Map<string, number>();

  projects: Project[]=[];
  Types: any[]=[];

  projectsShow: any[] = [];

  searchTerm: string = '';
  
  visibilityFilter: string = 'private';
  first = 0;
  rows = 10;

  permitions: any;

  selectedColumns!: string[];
  columns!: string[];
  showColumns!: string[];

  users : UserGetter[] = [];
  Users : any[] = []; // -> niz korisnika za filter 
  usersPhotos : PhotoForUser[] = [];

  showUserTasks: boolean = false;
  userIssues : IssueModel[] = [];
  issueColumns! : string[];
  selectedIssueColumns!: string[];
  issuesShow: any[] = [];

  constructor(
    public accoutService: AccountService,
    private projectService:ProjectService,
    private projectTypes:ProjectTypeService,
    private companyroleService: CompanyroleService,
    private userService: UserService,
    private userPictureService: UserProfilePicture,
    private issueService : IssueService
  ) { }

  ngOnInit(): void {
    this.columns = ['Key','Type','Owner','Creation Date','Due Date','Budget','Progress'];
    this.selectedColumns = ['Key','Type','Owner','Creation Date','Due Date','Progress'];
    this.showColumns = ['Name',...this.selectedColumns];

    this.issueColumns = ['Name','Type','Status','Priority', 'Due Date', 'Reporter', 'Completed'];

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

    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response.filter(user => user.username !== 'admin' && user.isActive == true);
        this.Users = this.users.map(item => item.username);
        // console.log(this.users);
        this.getUserProfilePhotos(this.users);
      }
    });
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

            const completion = this.calculateProjectCompletion(project.creationDate, project.dueDate);
            this.projectCompletionMap.set(project.key, completion);
          });
          this.filterProjects(this.visibilityFilter);
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }

  getUserProfilePhotos(users: UserGetter[]) {
    // console.log("1");
    for(const user of users) {
      if(user.profilePhoto != null) {
        this.userPictureService.getUserImage(user.username).subscribe({
          next: response => {
            let path = response['fileContents'];
            path = this.userPictureService.decodeBase64Image(response['fileContents']);
            var ph: PhotoForUser = {
              username: user.username, 
              photoSource: path
            };
            this.usersPhotos.push(ph);
            // console.log(this.usersPhotos);
          },
          error: error => {
            console.log(error);
          }
        });
      }
      else {
        var ph: PhotoForUser = {
          username: user.username,
          photoSource: "SLIKA_JE_NULL"
        }
        this.usersPhotos.push(ph);
      }
    }
  }

  getUserImagePath(username: string,users: UserGetter[]) {
    let index = users.findIndex(u => u.username === username);
    if(index == -1) return this.userPictureService.getFirstDefaultImagePath();

    if(users[index].profilePhoto == null)
      return this.userPictureService.getDefaultImageForUser(users[index].username);

    let ind = this.usersPhotos.findIndex(u => u.username == username);
    if(ind == -1) return this.userPictureService.getFirstDefaultImagePath();
    return this.usersPhotos[ind].photoSource;
  }

  calculateProjectCompletion(startDate: Date, endDate: Date): number {
    const currentDate = new Date();

    if(currentDate >= endDate){
      return 100;
    }

    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)); // Ukupan broj dana planiran za trajanje projekta
    // console.log(totalDays);
    const remainingDays = Math.ceil((endDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)); // Broj preostalih dana do kraja projekta
    // console.log("Preostalo " + remainingDays);
    const completedDays = totalDays - remainingDays; // Broj dana koji su već prošli
    

    if (totalDays <= 0) {
        return 0;
    }

    const completionPercentage = (completedDays / totalDays) * 100;
    return parseFloat(completionPercentage.toFixed(1));
  }

  getProgressBarClass(percentage: number | undefined): string {
    if(percentage != undefined){
      if (percentage <= 30) {
        return 'progress-green'; 
      } else if (percentage <= 70) {
        return 'progress-yellow';
      } else {
        return 'progress-red';
      }
    }
    else return "";
  }

  filterTasksByUser() {
    let user = this.accoutService.getCurrentUser(); //potencijalno dodati kao polje i da se onda samo jednom getuje username
    if(user){
      this.issueService.getUserIssues(user?.username).subscribe({
        next: (response) => {
          this.userIssues = response;
          this.issuesShow = response;
          console.log(this.userIssues);
        },
        error: (error) => {
          console.log(error.error);
        }
      });
    }

    this.showUserTasks = true;
  }

  getSeverity(status: string) {
    switch (status.toLowerCase()) {
        case 'highest':
            return 'danger';

        case 'lowest':
            return 'success';

        case 'medium':
            return 'info';

        case 'high':
            return 'warning';

        case 'bug':
            return 'danger';

        case 'story':
            return 'success';

        case 'done':
            return 'success';

        case 'planning':
            return 'info';

        default:
            return 'primary';
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
            this.showUserTasks = false;
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

  // Pretraga zadataka
  searchIssuesTable() {
    let x = document.getElementById("home-issues-search");
    if(x != null){
      x.innerHTML = "";
    }

    this.issuesShow = this.userIssues.filter(issue =>
        issue.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        issue.typeName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        issue.reporterUsername.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        issue.statusName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        issue.priorityName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getProjectImagePath(projectName : string): string {
    // let x: number = 1;
    // let path: string = ".././../../../assets/images/DefaultAccountProfileImages/default_account_image_" + x + ".png";
    let path = this.defaultImagePath;
    let projekat = this.projects.filter((project) => project.name == projectName)[0]

    if(projekat.icon == null) return this.defaultImagePath;
    return projekat.icon;
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

  MAX_ISSUE_NAME_LENGTH_DISPLAY = 20;
  getIssueName(issueName : string) : string{
    let s = "";
    if(issueName.length > this.MAX_ISSUE_NAME_LENGTH_DISPLAY)
      s = issueName.substring(0, this.MAX_ISSUE_NAME_LENGTH_DISPLAY) + "...";
    else
      s = issueName;
    
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

  getUsersThatAreProjectOwners() {
    let res: any[] = [];

    this.Users.forEach(username => {
      let x = this.projects.filter(p => p.ownerUsername == username);
      if(x.length > 0) {
        res.push(username);
      }
    })

    return res;
  }

}
