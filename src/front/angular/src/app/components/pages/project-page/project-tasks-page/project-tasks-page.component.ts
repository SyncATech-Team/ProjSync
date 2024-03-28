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
}
