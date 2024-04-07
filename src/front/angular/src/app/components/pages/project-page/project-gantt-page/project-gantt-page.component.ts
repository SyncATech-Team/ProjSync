import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-gantt-page',
  templateUrl: './project-gantt-page.component.html',
  styleUrl: './project-gantt-page.component.css'
})
export class ProjectGanttPageComponent implements OnInit {

  projectName: string = '';

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.projectName = this.route.snapshot.paramMap.get('projectName')!;
  }



}
