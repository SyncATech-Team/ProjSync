import { Component, OnInit } from '@angular/core';
import { IssueService } from '../../../../_service/issue.service';
import { ProjectService } from '../../../../_service/project.service';

@Component({
  selector: 'app-issue-dependencies',
  templateUrl: './issue-dependencies.component.html',
  styleUrl: './issue-dependencies.component.css'
})
export class IssueDependenciesComponent implements OnInit{
  cities : String[] = ["Test1","Test2"];
  selectedCity : String = "";

  constructor(
    private issueService: IssueService,
    private _projectService: ProjectService
  ){}

  ngOnInit(): void {
    
  }
}
