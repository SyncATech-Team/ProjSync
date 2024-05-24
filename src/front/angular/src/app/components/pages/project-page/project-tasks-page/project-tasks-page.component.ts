import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { IssueService } from '../../../../_service/issue.service';
import { GroupInProject } from '../../../../_models/group-in-project';
import { GroupService } from '../../../../_service/group.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IssueModalComponent } from '../../../elements/issues/issue-modal/issue-modal.component';
import { ProjectQuery } from '../../../state/project/project.query';
import { CreateTaskComponent } from '../../../elements/create-task/create-task.component';
import {ProjectService} from "../../../state/project/project.service";
import {JIssue} from "../../../../_models/issue";
import {PhotoForUser} from "../../../../_models/photo-for-user";
import {UserProfilePicture} from "../../../../_service/userProfilePicture.service";
import {UserOnProjectService} from "../../../../_service/userOnProject.service";
import {UserGetter} from "../../../../_models/user-getter";
import { TableLazyLoadEvent } from 'primeng/table';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-project-tasks-page',
  templateUrl: './project-tasks-page.component.html',
  styleUrl: './project-tasks-page.component.css'
})
export class ProjectTasksPageComponent implements OnInit, OnDestroy {
  projectName: string | null = '';
  subService!: Subscription;
  groupView: boolean=false;
  tableBody: string='body';
  dataKey: string = 'name';
  groupRowsBy: string = '';
  visible: boolean = true;
  visibleSide: boolean = true;
  selectedColumns!: string[];
  columns!: string[];
  showColumns!: string[];

  tasks : JIssue[] = [];
  tasks_backup: JIssue[]=[];
  searchTerm: string = '';
  searchTermChanged: Subject<string> = new Subject<string>();
  tasksByGroup: any[] = [];
  usersPhotos!: PhotoForUser[];
  users: UserGetter[] = [];
  groupsInProject : GroupInProject[] = [];
  issuesInGroup : JIssue[] = [];
  groupNames : any[] | undefined;

  issueType: string [] = ['Task','Bug','Story'];
  issuePriority: string [] = ['Lowest','Low','Medium','High','Highest'];
  issueStatus: string [] = ['Planning','In progress','Done'];

  first = 0;
  rows = 10;
  totalRecords = 0;
  completedValues: number[] = [0,100]; 

  ref: DynamicDialogRef | undefined;

  clickedModalForCreatingTask: boolean = false;

  lastLazyLoadEvent!: TableLazyLoadEvent;

  constructor (
    private route: ActivatedRoute,
    private issueService: IssueService,
    private groupService : GroupService,
    private _projectQuery: ProjectQuery,
    private _modalService: DialogService,
    private _projectService: ProjectService,
    public userPictureService: UserProfilePicture,
    private userOnProject : UserOnProjectService,
    private translateService: TranslateService
  ) {
    this.projectName = route.snapshot.paramMap.get('projectName');
    this.searchTermChanged.pipe(debounceTime(500), distinctUntilChanged()).subscribe(_ => this.loadIssues(this.lastLazyLoadEvent));
  }

  ngOnInit(): void {
    this.columns = ['Type','Status','Priority','Created Date','Updated Date','Due Date','Reporter','Group','Completed'];
    this.selectedColumns = ['Type','Priority','Due Date','Reporter','Completed','Group'];
    this.showColumns = ['Name',...this.selectedColumns];
    this._projectService.getProject(this.projectName!);

    // this.tasksByGroup = this.getTasksByGroup();
    if(this.projectName) {
      // this.issueService.getAllIssuesForProject(this.projectName).subscribe({
      //   next: (response) =>{
      //     this.tasks = response;
      //     this.tasks_backup = this.tasks;
      //   },
      //   error: (err) => {
      //     console.log(err);
      //   }
      // })
      
      this.groupService.getAllGroups(this.projectName).subscribe({
        next: (response) => {
          this.groupsInProject = response;
          this.groupNames = this.groupsInProject.map(group => group.name);
          //this.tasksByGroup = this.getTasksByGroup();
          // console.log(this.tasks);
        },
        error: (error) => {
          console.log(error);
        }
      });

      this.userOnProject.getAllUsersOnProject(this.projectName).subscribe({
        next: (response) => {
          this.users = response.filter(user => user.username !== 'admin');
          this.usersPhotos = this.userPictureService.getUserProfilePhotos(this.users);
        },
        error: (error) => {
          console.log(error);
        }
      });
    }

  }

  // getTasksByGroup(): any{
  //   // var groups = new Set(this.tasks.map(item => item.groupName));
  //   var result: any[] = [];
  //   this.groupsInProject.forEach(group => {
  //     this.issueService.getAllIssuesInGroup(group.id).subscribe({
  //       next: (response) =>{
  //         for(let element of response){
  //           this.tasks.push(element);
  //         }
  //         this.issuesInGroup = response;
  //         this.tasks_backup = this.issuesInGroup;
  //         result.push({
  //           group: group.name,
  //           tasks: this.issuesInGroup
  //         });
  //       },
  //       error: (error) => {
  //         console.log(error);
  //       }
  //     });
  //   });
  //   return result;
  // }

  ngOnDestroy(): void {
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  // changeView():void {
  //   if(this.groupView){
  //     this.dataKey = 'group';
  //   }
  //   else{
  //     this.dataKey = 'name';
  //   }

  //   this.visible = false;
  //   setTimeout(() => this.visible = true, 0);
  // }

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

  search() {
    this.searchTermChanged.next(this.searchTerm);
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

  openIssueModal(issueId : string){
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
  
      this.ref.onClose.subscribe({
        next: _ => {
          this.tasks = [];
          this.tasksByGroup = [];
          this.tasks_backup = [];
          this.ngOnInit();
          this.loadIssues(this.lastLazyLoadEvent);
        }
      });
    });
  }

  showCreateTaskPopupTaskList() {
    this.clickedModalForCreatingTask = true;
    this.ref = this._modalService.open(CreateTaskComponent, {
      header: 'Create task',
        width: '50%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        closable: true,
        modal: true,
        dismissableMask: true,
        closeOnEscape: true,
        breakpoints: {
          '960px': '75vw',
          '640px': '94vw'
        },
        data: {
          projectName: this.projectName
        }
    });

    this.ref.onClose.subscribe((data: any) => {
      this.clickedModalForCreatingTask = false;

      if(data !== "created-task") return;         // NE REFRESHUJ STRANICU AKO NIJE DODAT ZADATAK

      // console.log("Response: " + data + " . Refreshing tasks...");
      this.tasks = [];
      this.tasksByGroup = [];
      this.tasks_backup = [];
      this.ngOnInit();
      this.loadIssues(this.lastLazyLoadEvent);
    });

  }

  loadIssues(event: TableLazyLoadEvent){
    this.lastLazyLoadEvent = event;
    if(this.projectName)
    {
      this.issueService.getPaginationAllIssuesForProject(this.projectName,event,this.searchTerm.toLowerCase().trim()).subscribe({
        next: (response) => {
          this.tasks = response.issues;
          this.totalRecords = response.numberOfRecords;
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }

  getTrimmedTitle(current: string) {
    const MAX_NUMBER_OF_CHARACTERS = 20;
    if(current.length <= MAX_NUMBER_OF_CHARACTERS) return current;
    return current.substring(0, MAX_NUMBER_OF_CHARACTERS) + "...";
  }

  roundValue(value: number): number {
    return Math.round(value);
  }
}
