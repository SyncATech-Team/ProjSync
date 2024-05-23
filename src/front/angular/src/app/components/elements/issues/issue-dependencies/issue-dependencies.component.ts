import { Component, Input, OnInit } from '@angular/core';
import { IssueService } from '../../../../_service/issue.service';
import { ProjectService } from '../../../../_service/project.service';
import { JIssue } from '../../../../_models/issue';

@Component({
  selector: 'app-issue-dependencies',
  templateUrl: './issue-dependencies.component.html',
  styleUrl: './issue-dependencies.component.css'
})
export class IssueDependenciesComponent implements OnInit{
  @Input() issue!: JIssue;
  issues : JIssue[] = [];
  projectName : string = "";

  constructor(
    private issueService: IssueService,
    private _projectService: ProjectService
  ){}

  ngOnInit(): void {
    console.log(this.issue.id);
    const issueId = Number(this.issue.id);
    this.issueService.getProjectNameByIssueId(issueId).subscribe({
      next:(response)=>{
        this.projectName = response.projectName;
        console.log(this.projectName);
      },
      error:(error)=>{
        console.log(error.error);
      }
    });
  }

  funk(){
    this.issueService.getAllIssuesForProject(this.projectName).subscribe({
      next:(response)=>{
        this.issues = response;
        console.log(response);
      },
      error:(error)=>{
        console.log(error.error);
      }
    })
  }

  public get getIssues() : JIssue[]{
    return this.issues;
  }
}
