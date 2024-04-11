import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IssueService } from '../../../../_service/issue.service';

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

  tasks_backup: any[]=[];
  searchTerm: string = '';
  tasksByGroup: any[] = [];

  tasks: any[]=[
    {
      name: 'task1',
      typeName: 'Story',
      statusName: 'Planning',
      priorityName: 'Highest',
      description: 'desccription',
      createdDate: new Date(),
      updatedDate: new Date(),
      dueDate: new Date(),
      reporterUsername: 'mika.mikic',
      groupName: 'group1',
      projectName: 'project1',
      dependentOn: '',
      percentage: 25
    },
    {
      name: 'task2',
      typeName: 'Problem',
      statusName: 'Planning',
      priorityName: 'High',
      description: 'desccription',
      createdDate: new Date(),
      updatedDate: new Date(),
      dueDate: new Date(),
      reporterUsername: 'misa.mikic',
      groupName: 'group2',
      projectName: 'project1',
      dependentOn: 'task2',
      percentage: 0
    },
    {
      name: 'task3',
      typeName: 'Problem',
      statusName: 'Planning',
      priorityName: 'Low',
      description: 'desccription',
      createdDate: new Date(),
      updatedDate: new Date(),
      dueDate: new Date(),
      reporterUsername: 'misa.mikic',
      groupName: 'group1',
      projectName: 'project1',
      dependentOn: 'task2',
      percentage: 20
    },
    {
      name: 'task4',
      typeName: 'Problem',
      statusName: 'In progress',
      priorityName: 'High',
      description: 'desccription',
      createdDate: new Date(),
      updatedDate: new Date(),
      dueDate: new Date(),
      reporterUsername: 'misa.mikic',
      groupName: 'group1',
      projectName: 'project1',
      dependentOn: 'task2',
      percentage: 20
    },
    {
      name: 'task5',
      typeName: 'Task',
      statusName: 'Done',
      priorityName: 'Highest',
      description: 'desccription',
      createdDate: new Date(),
      updatedDate: new Date(),
      dueDate: new Date(),
      reporterUsername: 'nikola.nikolic',
      groupName: 'group1',
      projectName: 'project1',
      dependentOn: 'task2',
      percentage: 30
    },
    {
      name: 'task6',
      typeName: 'Task',
      statusName: 'Planning',
      priorityName: 'Lowest',
      description: 'desccription',
      createdDate: new Date(),
      updatedDate: new Date(),
      dueDate: new Date(),
      reporterUsername: 'nikola.nikolic',
      groupName: 'group1',
      projectName: 'project1',
      dependentOn: 'task2',
      percentage: 40
    },
    {
      name: 'task7',
      typeName: 'Task',
      statusName: 'Done',
      priorityName: 'Lowest',
      description: 'desccription',
      createdDate: new Date(),
      updatedDate: new Date(),
      dueDate: new Date('10/05/2024'),
      reporterUsername: 'nikola.nikolic',
      groupName: 'group1',
      projectName: 'project1',
      dependentOn: 'task2',
      percentage: 50
    },
    {
      name: 'task8',
      typeName: 'Task',
      statusName: 'Done',
      priorityName: 'Medium',
      description: 'desccription',
      createdDate: new Date(),
      updatedDate: new Date(),
      dueDate: new Date('10/05/2024'),
      reporterUsername: 'pera.peric',
      groupName: 'group1',
      projectName: 'project1',
      dependentOn: 'task2',
      percentage: 60
    },
    {
      name: 'task9',
      typeName: 'Task',
      statusName: 'Done',
      priorityName: 'High',
      description: 'desccription',
      createdDate: new Date(),
      updatedDate: new Date(),
      dueDate: new Date('10/04/2024'),
      reporterUsername: 'pera.peric',
      groupName: 'group1',
      projectName: 'project1',
      dependentOn: 'task2',
      percentage: 75
    },
    {
      name: 'task10',
      typeName: 'Task',
      statusName: 'In progress',
      priorityName: 'Low',
      description: 'desccription',
      createdDate: new Date(),
      updatedDate: new Date(),
      dueDate: new Date('10/04/2024'),
      reporterUsername: 'pera.peric',
      groupName: 'group3',
      projectName: 'project1',
      dependentOn: 'task2',
      percentage: 100
    },
    {
      name: 'task11',
      typeName: 'Task',
      statusName: 'In progress',
      priorityName: 'Medium',
      description: 'desccription',
      createdDate: new Date(),
      updatedDate: new Date(),
      dueDate: new Date('10/04/2024'),
      reporterUsername: 'pera.peric',
      groupName: 'group3',
      projectName: 'project1',
      dependentOn: 'task2',
      percentage: 10
    },
  ];
  issueType: string [] = ['Task','Problem','Story'];
  issuePriority: string [] = ['Lowest','Low','Medium','High','Highest'];
  issueStatus: string [] = ['Planning','In progress','Done'];

  first = 0;
  rows = 10;

  constructor (private route: ActivatedRoute, private issueService: IssueService) {
    this.projectName = route.snapshot.paramMap.get('projectName');
  }

  ngOnInit(): void {
    this.tasks_backup = this.tasks;
    this.columns = ['Type','Status','Priority','Description','Created Date','Updated Date','Due Date','Reporter','Group','Percentage'];
    this.selectedColumns = ['Type','Priority','Due Date','Reporter','Percentage'];
    this.showColumns = ['Name',...this.selectedColumns];
    this.tasksByGroup = this.getTasksByGroup();
  }

  getTasksByGroup(): any{
    var groups = new Set(this.tasks.map(item => item.groupName));
    var result: any[] = [];
    groups.forEach(g => result.push({
      group: g,
      tasks: this.tasks.filter(item => item.groupName===g)
    }));
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

        case 'problem':
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
    let searchTerm = this.searchTerm.toLowerCase().trim();
    let filteredTasks = [...this.tasks_backup];
  
    if (searchTerm) {
      filteredTasks = filteredTasks.filter(task => task.name.toLowerCase().includes(searchTerm));
    }
    this.tasks = filteredTasks;
    this.tasksByGroup = this.getTasksByGroup();
  }

  onSelectedChange(){
    this.selectedColumns.forEach(item => {
      if(!this.showColumns.includes(item)){
        this.showColumns.push(item);
      }
    });
    this.showColumns.forEach((item,index) => {
      if(!this.selectedColumns.includes(item) && item!=='Username' && item !==''){
        this.showColumns.splice(index,1);
      }
    })
  }
}
