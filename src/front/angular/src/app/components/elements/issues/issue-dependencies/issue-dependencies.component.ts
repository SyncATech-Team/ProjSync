import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { IssueService } from '../../../../_service/issue.service';
import { JIssue } from '../../../../_models/issue';
import { IssueDependencyUpdater } from '../../../../_models/issue-dependency-create-delete';
import { ProjectQuery } from '../../../state/project/project.query';
import { ProjectService } from '../../../state/project/project.service';
import { IssueDependenciesGetter } from '../../../../_models/issueDependenciesGetter.model';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-issue-dependencies',
  templateUrl: './issue-dependencies.component.html',
  styleUrl: './issue-dependencies.component.css'
})
export class IssueDependenciesComponent implements OnInit{
  @Input() issue!: JIssue;
  @Input() canManageTask!: string;
  
  issues : JIssue[] = [];
  projectName : string = "";

  constructor(
    private issueService: IssueService,
    private _projectService: ProjectService,
    private projectQuery: ProjectQuery,
    private cdr: ChangeDetectorRef,
  ){}

  ngOnInit(): void {
    this.cdr.markForCheck();
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
    this.projectQuery.issues$.subscribe({
      next: (response) => {
        this.issues = response.filter((issue: JIssue) => issue.id !== this.issue.id
        && this.issue.predecessors.findIndex(e=> "" + e.id == issue.id) == -1);
      }
    })
  }

  showOptionsSuccessor() {

    this.projectQuery.issues$.subscribe({
      next: (response) => {
        this.issues = response.filter((issue: JIssue) => issue.id !== this.issue.id
        && this.issue.successors.findIndex(e=>"" + e.id == issue.id) == -1);
      }
    })
  }

  public get getIssues() : JIssue[]{
    return this.issues;
  }

  addPredecessor(issueSelected: JIssue, op: OverlayPanel) {
    const originIssueId = Number(issueSelected.id);
    const targetIssueId = Number(this.issue.id);
    let modelGetter: IssueDependenciesGetter = {
      id: Number(issueSelected.id),
      name: issueSelected.title,
      isPredecessor: true,
      projectName: issueSelected.projectName,
      groupName: issueSelected.groupName
    }

    let modelUpdater: IssueDependencyUpdater = {
      originId : originIssueId,
      targetId : targetIssueId,
      isDelete : false
    }

    this._projectService.addPredecessorOrSuccessor(this.issue, modelGetter, modelUpdater);
    op.hide();
  }

  addSuccessor(issueSelected:JIssue, op: OverlayPanel){
    const originIssueId = Number(this.issue.id);
    const targetIssueId = Number(issueSelected.id);

    let modelGetter: IssueDependenciesGetter = {
      id: Number(issueSelected.id),
      name: issueSelected.title,
      isPredecessor: false,
      projectName: issueSelected.projectName,
      groupName: issueSelected.groupName
    }

    let modelUpdater: IssueDependencyUpdater = {
      originId : originIssueId,
      targetId : targetIssueId,
      isDelete : false
    }

    this._projectService.addPredecessorOrSuccessor(this.issue, modelGetter, modelUpdater);
    op.hide();
  }

  deletePredecessor(predecessor : any) {
    const originIssueId = Number(predecessor.id);
    const targetIssueId = Number(this.issue.id);
    let modelUpdater: IssueDependencyUpdater = {
      originId : originIssueId,
      targetId : targetIssueId,
      isDelete : true
    }

    let modelGetter: IssueDependenciesGetter = {
      id: Number(predecessor.id),
      name: predecessor.title,
      isPredecessor: true,
      projectName: predecessor.projectName,
      groupName: predecessor.groupName
    }

    this._projectService.removePredecessorOrSuccessor(this.issue, modelGetter, modelUpdater);
  }

  deleteSuccessor(successor: any) {
    const originIssueId = Number(this.issue.id);
    const targetIssueId = Number(successor.id);
    let modelUpdater: IssueDependencyUpdater = {
      originId : originIssueId,
      targetId : targetIssueId,
      isDelete : true
    }

    let modelGetter: IssueDependenciesGetter = {
      id: Number(successor.id),
      name: successor.title,
      isPredecessor: false,
      projectName: successor.projectName,
      groupName: successor.groupName
    }

    this._projectService.removePredecessorOrSuccessor(this.issue, modelGetter, modelUpdater);
  }

  getTrimmedTitle(current: string, flag : number) {
    let MAX_NUMBER_OF_CHARACTERS;

    if(flag == 1){
      MAX_NUMBER_OF_CHARACTERS = 19;
    }
    else{
      MAX_NUMBER_OF_CHARACTERS = 8;
    }
    
    if(current.length <= MAX_NUMBER_OF_CHARACTERS)
    {
      return current;
    }

    return current.substring(0, MAX_NUMBER_OF_CHARACTERS) + "...";
  }
}