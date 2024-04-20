import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IssueService } from '../../../../_service/issue.service';
import { GroupInProject } from '../../../../_models/group-in-project';
import { GroupService } from '../../../../_service/group.service';
import { IssueModel } from '../../../../_models/model-issue.model';
import { ProgressBarModule } from 'primeng/progressbar';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IssueModalComponent } from '../../../elements/issues/issue-modal/issue-modal.component';
import { ProjectQuery } from '../../../state/project/project.query';
import { CreateTaskComponent } from '../../../elements/create-task/create-task.component';

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

  tasks : IssueModel[] = [];
  tasks_backup: IssueModel[]=[];
  searchTerm: string = '';
  tasksByGroup: any[] = [];

  groupsInProject : GroupInProject[] = [];
  issuesInGroup : IssueModel[] = [];

  issueType: string [] = ['Task','Bug','Story'];
  issuePriority: string [] = ['Lowest','Low','Medium','High','Highest'];
  issueStatus: string [] = ['Planning','In progress','Done'];

  first = 0;
  rows = 10;

  ref: DynamicDialogRef | undefined;

  clickedModalForCreatingTask: boolean = false;

  constructor (
    private route: ActivatedRoute, 
    private issueService: IssueService, 
    private groupService : GroupService,
    private _projectQuery: ProjectQuery, 
    private _modalService: DialogService
  ) {
    this.projectName = route.snapshot.paramMap.get('projectName');
  }

  ngOnInit(): void {
    this.columns = ['Type','Status','Priority','Created Date','Updated Date','Due Date','Reporter','Group','Completed'];
    this.selectedColumns = ['Type','Priority','Due Date','Reporter','Completed'];
    this.showColumns = ['Name',...this.selectedColumns];
    // this.tasksByGroup = this.getTasksByGroup();
    if(this.projectName)
      this.groupService.getAllGroups(this.projectName).subscribe({
        next: (response) => {
          this.groupsInProject = response;

          this.tasksByGroup = this.getTasksByGroup();
          // console.log(this.tasks);
          this.tasks_backup = this.tasks;
        },
        error: (error) => {
          console.log(error);
        }
      });
  }

  getTasksByGroup(): any{
    // var groups = new Set(this.tasks.map(item => item.groupName));
    var result: any[] = [];
    this.groupsInProject.forEach(group => {
      this.issueService.getAllIssuesInGroup(group.id).subscribe({
        next: (response) =>{
          for(let element of response){
            this.tasks.push(element);
          }
          this.issuesInGroup = response;
          this.tasks_backup = this.issuesInGroup;
          result.push({
            group: group.name,
            tasks: this.issuesInGroup
          });
        },
        error: (error) => {
          console.log(error);
        }
      });
    });
    return result;
  }

  ngOnDestroy(): void {
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }
  
  changeView():void {
    if(this.groupView){
      this.dataKey = 'group';
    }
    else{
      this.dataKey = 'name';
    }
      
    this.visible = false;
    setTimeout(() => this.visible = true, 0);
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

  search() {
    alert("Ne koristiti - Potrebno napisati optimalnije ili ukloniti.");
    // let searchTerm = this.searchTerm.toLowerCase().trim();
    // let filteredTasks = [...this.tasks_backup];
  
    // if (searchTerm) {
    //   filteredTasks = filteredTasks.filter(task => task.name.toLowerCase().includes(searchTerm));
    // }
    // this.tasks = filteredTasks;
    // this.tasksByGroup = this.getTasksByGroup();
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
    this.ref = this._modalService.open(IssueModalComponent, {
      header: 'Issue - update',
      width: '65%',
      modal:true,
      closable: true,
      dismissableMask: true,
      closeOnEscape: true,
      breakpoints: {
          '960px': '75vw',
          '640px': '90vw'
      },
      data: {
        issue$: this._projectQuery.issueById$(issueId)
      }
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
        data: {
          projectName: this.projectName
        }
    });

    this.ref.onClose.subscribe((data: any) => {
      this.clickedModalForCreatingTask = false;
      
      if(data !== "created-task") return;         // NE REFRESHUJ STRANICU AKO NIJE DODAT ZADATAK

      console.log("Response: " + data + " . Refreshing tasks...");
      this.tasks = [];
      this.tasksByGroup = [];
      this.tasks_backup = [];
      this.ngOnInit();
    });

  }

}
