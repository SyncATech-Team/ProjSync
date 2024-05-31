import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../_service/account.service';
import { Project } from '../../../_models/project.model';
import { ProjectService } from '../../../_service/project.service';
import { ProjectTypeService } from '../../../_service/project-type.service';
import { ProjectType } from '../../../_models/project-type';
import { UserService } from '../../../_service/user.service';
import { UserGetter } from '../../../_models/user-getter';
import { PhotoForUser } from '../../../_models/photo-for-user';
import { UserProfilePicture } from '../../../_service/userProfilePicture.service';
import { IssueService } from '../../../_service/issue.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IssueModalComponent } from '../../elements/issues/issue-modal/issue-modal.component';
import { ProjectQuery } from '../../state/project/project.query';
import { ProjectService as ProjectService2 } from '../../state/project/project.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { StatisticsService } from '../../../_service/statistics.service';
import { JIssue } from '../../../_models/issue';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  projectImageSource : string = "";
  defaultImagePath : string = "../../../../assets/project-icon/default_project_image.png";
  projectCompletioTimeMap: Map<string, number> = new Map<string, number>();
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
  selectedTab : string = "myProjects";
  userIssues : JIssue[] = [];
  issueColumns! : string[];
  selectedIssueColumns!: string[];
  showIssueColumns!: string[];
  issuesShow: any[] = [];
  ref: DynamicDialogRef | undefined;
  IssueTypes : any[] = ["Bug", "Story", "Task"];
  IssueStatus: any[] = ["Planning", "In progress", "Done"];
  IssuePrioritys: any[] = ["Lowest", "Low", "Medium", "High", "Highest"];

  completedValues: number[] = [0,1]; 

  constructor(
    public accoutService: AccountService,
    private projectService:ProjectService,
    private projectTypes:ProjectTypeService,
    private userService: UserService,
    private userPictureService: UserProfilePicture,
    private issueService : IssueService,
    private _modalService: DialogService,
    private _projectQuery: ProjectQuery,
    private _projectService: ProjectService2,
    private route: ActivatedRoute,
    private router: Router,
    private statisticService: StatisticsService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {

    let routeShowTasks = undefined;
    this.route.queryParams.subscribe(params => {
      routeShowTasks = params['showUserTasks'];
    });

    this.columns = ['Key','Type','Owner','Creation Date','Due Date','Budget','Progress'];
    this.selectedColumns = ['Key','Type','Owner','Due Date','Progress'];
    this.showColumns = ['Name',...this.selectedColumns];

    this.issueColumns = ['Type','Status','Priority', 'Due Date', 'Reporter', 'Completed', 'CreatedDate'];
    this.selectedIssueColumns = ['Type','Status','Priority', 'Due Date', 'ProjectName', 'Completed'];
    this.showIssueColumns = ['Name', ...this.selectedIssueColumns];

    this.initializeProjects();
    this.projectTypes.getAllProjectTypes().subscribe({
      next: (response: ProjectType[]) =>{
        this.Types = response.map(item => item.name);
      }
    });
    
    var user = this.accoutService.getCurrentUser();
    if(user?.permitions)
      this.permitions = user.permitions;

    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response.filter(user => user.username !== 'admin' && user.isActive == true);
        this.Users = this.users.map(item => item.username);
        // console.log(this.users);
        this.getUserProfilePhotos(this.users);
      }
    });

    if(routeShowTasks == 'true') { this.filterTasksByUser(); }
    else { this.filterProjects('public'); }

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.handleRouteChange();
      }
    });
  }

  handleRouteChange() {
    this.route.queryParams.subscribe(params => {
      const routeShowTasks = params['showUserTasks'];
      if (routeShowTasks === 'true') {
        this.filterTasksByUser();
      } else {
        this.filterProjects('public');
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
          // console.log(this.projects);
          this.projects.forEach((project)=>{ 
            project.isExtanded = false;
            project.isFavorite = false;
            project.creationDate = new Date(project.creationDate);
            project.dueDate = new Date(project.dueDate); 

            const completion = this.calculateProjectCompletionTime(project.creationDate, project.dueDate);
            this.projectCompletioTimeMap.set(project.key, Math.floor(completion));
            this.projectCompletionMap.set(project.key, Math.floor(project.projectProgress! * 100));
          });

          for(let i=this.projects.length-1;  i >= 0 ; i--){
            if(this.projects[i].projectProgress === 1)
                this.projects.push(this.projects.splice(i,1)[0]);
          }

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
  
  calculateProjectCompletionTime(startDate: Date, endDate: Date): number {
    const currentDate = new Date();

    if(currentDate >= endDate){
      return 100;
    }
    else if(currentDate <= startDate){
      return 0;
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

  getClassForProjectProgress(percentage: number | undefined): string {
    if(percentage != undefined){
      if (percentage <= 15) {
        return 'project-progress-red'; 
      }
      else if(percentage <= 45){
        return 'project-progress-orange'
      }
      else if (percentage <= 70) {
        return 'project-progress-green';
      } else {
        return 'project-progress-light-green';
      }
    }
    else return "";
  }

  filterTasksByUser() {
    this.selectedTab = 'myTasks';
    let user = this.accoutService.getCurrentUser(); //potencijalno dodati kao polje i da se onda samo jednom getuje username
    if(user){
      this.issueService.getUserIssues(user?.username).subscribe({
        next: (response) => {
          this.userIssues = response;
          this.userIssues.forEach((issue)=>{
            issue.createdAt = new Date(issue.createdAt).toISOString(); // Convert Date object to string
            issue.dueDate = new Date(issue.dueDate).toISOString();
          });
          this.issuesShow = response;
          
          // convert createdAt from string to Date for all issues
          this.issuesShow.forEach((issue) => {
            issue.createdAt = new Date(issue.createdAt);
            issue.dueDate = new Date(issue.dueDate);
            issue.updatedAt = new Date(issue.updatedAt);
          });

          // console.log(this.userIssues);
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
    this.selectedTab = 'myProjects';
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
        issue.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        issue.type.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        issue.reporterUsername.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        issue.status.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        issue.priority.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        issue.projectName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getProjectImagePath(projectName : string): string {
    // let x: number = 1;
    // let path: string = ".././../../../assets/images/DefaultAccountProfileImages/default_account_image_" + x + ".png";
    let path = this.defaultImagePath;
    let projekat = this.projects.filter((project) => project.name == projectName)[0];
    if(projekat == undefined){
      return path;
    }

    if(projekat.icon == null) return path;
    return projekat.icon;
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  test(tst : any){
    // console.log(tst);
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

  MAX_TASK_NAME_LENGTH_DISPLAY = 20;
  getTaskName(taskName: string): string {
    let s: string = "";
    if(taskName.length > this.MAX_TASK_NAME_LENGTH_DISPLAY)
      s = taskName.substring(0, this.MAX_TASK_NAME_LENGTH_DISPLAY) + "...";
    else
      s = taskName;

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

  // Odabir prikaza kolona za projekte i zadatke
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

  onSelectedIssueChange(){
    this.selectedIssueColumns.forEach(item => {
      if(!this.showIssueColumns.includes(item)){
        this.showIssueColumns.push(item);
      }
    });
    this.showIssueColumns.forEach((item,index) => {
      if(!this.selectedIssueColumns.includes(item) && item!=='Name' && item !==''){
        this.showIssueColumns.splice(index,1);
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

  // Otvaranje modala za edit issue edit
  openIssueModal(issueId : string, projectName: string){
    // console.log(issueId);
    this._projectService.getProject(projectName);
    this.translateService.get('issue.issue-details').subscribe((res: string) => {
      this.ref = this._modalService.open(IssueModalComponent, {
        header: res,
        width: '65%',
        modal:true,
        closable: true,
        maximizable: true,
        dismissableMask: true,
        closeOnEscape: true,
        breakpoints: {
            '960px': '75vw',
            '640px': '90vw'
        },
        data: {
          issue$: this._projectQuery.issueById$(issueId.toString()),
          usersPhotos: this.usersPhotos
        }
      });
    });
  }

  get tasksTabSelected() {
    return this.showUserTasks;
  }

  roundValue(value: number): number {
    return Math.round(value);
  }

}
