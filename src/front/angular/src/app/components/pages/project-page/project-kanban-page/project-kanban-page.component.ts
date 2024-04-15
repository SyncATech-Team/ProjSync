import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../state/project/project.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-kanban-page',
  templateUrl: './project-kanban-page.component.html',
  styleUrl: './project-kanban-page.component.css'
})
export class ProjectKanbanPageComponent implements OnInit {
  
  projectName: string = '';
  
  constructor(
    private _projectService: ProjectService,
    private route: ActivatedRoute
  ){
  }

  ngOnInit(): void {
    this.projectName = this.route.snapshot.paramMap.get('projectName')!;
    this._projectService.getProject();
  }
}
