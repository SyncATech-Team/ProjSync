import { Component, Input, OnInit } from '@angular/core';
import { IssueService } from '../../../../_service/issue.service';
import { ProjectService } from '../../../../_service/project.service';
import { JIssue } from '../../../../_models/issue';
import { IssueDependencyUpdater } from '../../../../_models/issue-dependency-create-delete';

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
    console.log(this.issue);
    const issueId = Number(this.issue.id);
    this.issueService.getProjectNameByIssueId(issueId).subscribe({
      next: (response) => {
        this.projectName = response.projectName;
      },
      error: (error) => {
        console.log(error.error);
      }
    });
  }

  showOptionsPredecessor() {
    this.issueService.getAllIssuesForProject(this.projectName).subscribe({
      next: (response) => {
        this.issues = response.filter((issue: JIssue) => issue.id !== this.issue.id
        && this.issue.predecessors.findIndex(e=> "" + e.id == issue.id) == -1);
      },
      error: (error) => {
        console.log(error.error);
      }
    });
  }

  showOptionsSuccessor() {
    this.issueService.getAllIssuesForProject(this.projectName).subscribe({
      next: (response) => {
        this.issues = response.filter((issue: JIssue) => issue.id !== this.issue.id
        && this.issue.successors.findIndex(e=>"" + e.id == issue.id) == -1);
      },
      error: (error) => {
        console.log(error.error);
      }
    });
  }

  public get getIssues() : JIssue[]{
    return this.issues;
  }

  addPredecessor(issue: JIssue) {
    const originIssueId = Number(issue.id);
    const targetIssueId = Number(this.issue.id);
    let model: IssueDependencyUpdater = {
      originId : originIssueId,
      targetId : targetIssueId,
      isDelete : false
    }
    this.issueService.createOrDeleteIssueDependency(model).subscribe({
      next:(response) =>{
        this.ngOnInit();
      },
      error:(error) => {

      }
    });
  }

  addSuccessor(issue:JIssue){
    const originIssueId = Number(this.issue.id);
    const targetIssueId = Number(issue.id);
    let model: IssueDependencyUpdater = {
      originId : originIssueId,
      targetId : targetIssueId,
      isDelete : false
    }
    this.issueService.createOrDeleteIssueDependency(model).subscribe({
      next:(response) =>{
        this.ngOnInit();
      },
      error:(error) => {

      }
    });
  }
}
