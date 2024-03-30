import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TaskService } from '../../../../_service/task.service';
import { TasksInGroup } from '../../../../_models/tasks-in-group';

@Component({
  selector: 'app-project-tasks-page',
  templateUrl: './project-tasks-page.component.html',
  styleUrl: './project-tasks-page.component.css'
})
export class ProjectTasksPageComponent implements OnInit, OnDestroy {
  projectName: string | null = '';
  subService!: Subscription;
  tasksInGroup: TasksInGroup[] = [];
  tasks: TasksInGroup[]=[
    {
      name: 'task1',
      typeName: 'type1',
      statusName: 'status1',
      priorityName: 'urgent',
      description: 'desccription',
      createdDate: new Date(),
      updatedDate: new Date(),
      dueDate: new Date(),
      reporterUsername: 'repoeter1',
      groupName: 'group1',
      projectName: 'project1',
      dependentOn: ''
    },
    {
      name: 'task2',
      typeName: 'type2',
      statusName: 'status2',
      priorityName: 'urgent',
      description: 'desccription',
      createdDate: new Date(),
      updatedDate: new Date(),
      dueDate: new Date(),
      reporterUsername: 'repoeter1',
      groupName: 'group2',
      projectName: 'project1',
      dependentOn: 'task2'
    },
    {
      name: 'task3',
      typeName: 'type1',
      statusName: 'status1',
      priorityName: 'urgent',
      description: 'desccription',
      createdDate: new Date(),
      updatedDate: new Date(),
      dueDate: new Date(),
      reporterUsername: 'repoeter1',
      groupName: 'group1',
      projectName: 'project1',
      dependentOn: 'task2'
    },
    {
      name: 'task4',
      typeName: 'type1',
      statusName: 'status1',
      priorityName: 'urgent',
      description: 'desccription',
      createdDate: new Date(),
      updatedDate: new Date(),
      dueDate: new Date(),
      reporterUsername: 'repoeter1',
      groupName: 'group1',
      projectName: 'project1',
      dependentOn: 'task2'
    },
    {
      name: 'task5',
      typeName: 'type1',
      statusName: 'status1',
      priorityName: 'urgent',
      description: 'desccription',
      createdDate: new Date(),
      updatedDate: new Date(),
      dueDate: new Date(),
      reporterUsername: 'repoeter1',
      groupName: 'group1',
      projectName: 'project1',
      dependentOn: 'task2'
    },
    {
      name: 'task6',
      typeName: 'type1',
      statusName: 'status1',
      priorityName: 'urgent',
      description: 'desccription',
      createdDate: new Date(),
      updatedDate: new Date(),
      dueDate: new Date(),
      reporterUsername: 'repoeter1',
      groupName: 'group1',
      projectName: 'project1',
      dependentOn: 'task2'
    },
    {
      name: 'task7',
      typeName: 'type1',
      statusName: 'status1',
      priorityName: 'urgent',
      description: 'desccription',
      createdDate: new Date(),
      updatedDate: new Date(),
      dueDate: new Date(),
      reporterUsername: 'repoeter1',
      groupName: 'group1',
      projectName: 'project1',
      dependentOn: 'task2'
    },
    {
      name: 'task8',
      typeName: 'type1',
      statusName: 'status1',
      priorityName: 'urgent',
      description: 'desccription',
      createdDate: new Date(),
      updatedDate: new Date(),
      dueDate: new Date(),
      reporterUsername: 'repoeter1',
      groupName: 'group1',
      projectName: 'project1',
      dependentOn: 'task2'
    },
    {
      name: 'task9',
      typeName: 'type1',
      statusName: 'status1',
      priorityName: 'urgent',
      description: 'desccription',
      createdDate: new Date(),
      updatedDate: new Date(),
      dueDate: new Date(),
      reporterUsername: 'repoeter1',
      groupName: 'group1',
      projectName: 'project1',
      dependentOn: 'task2'
    },
    {
      name: 'task10',
      typeName: 'type1',
      statusName: 'status1',
      priorityName: 'urgent',
      description: 'desccription',
      createdDate: new Date(),
      updatedDate: new Date(),
      dueDate: new Date(),
      reporterUsername: 'repoeter1',
      groupName: 'group1',
      projectName: 'project1',
      dependentOn: 'task2'
    },
    {
      name: 'task11',
      typeName: 'type1',
      statusName: 'status1',
      priorityName: 'urgent',
      description: 'desccription',
      createdDate: new Date(),
      updatedDate: new Date(),
      dueDate: new Date(),
      reporterUsername: 'repoeter1',
      groupName: 'group1',
      projectName: 'project1',
      dependentOn: 'task2'
    },
  ];

  first = 0;
  rows = 10;

  constructor (private route: ActivatedRoute, private taskService: TaskService) {
    this.projectName = route.snapshot.paramMap.get('projectName');
  }

  ngOnInit(): void {
    this.subService = this.taskService.getAllTasksInGroup(1).subscribe({
      next: response => {
        this.tasksInGroup = response;
        console.log('dobijeni taskovi')
      }
    })
  }

  ngOnDestroy(): void {
    this.subService.unsubscribe();
  }

  pageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }
}
