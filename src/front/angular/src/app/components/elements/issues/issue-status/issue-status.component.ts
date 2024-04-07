import { Component, Input } from '@angular/core';
import { IssueStatus, IssueStatusDisplay, JIssue } from '../../../../_models/issue';
import {ProjectService} from "../../../state/project/project.service";
import {ProjectQuery} from "../../../state/project/project.query";

@Component({
  selector: 'issue-status',
  templateUrl: './issue-status.component.html',
  styleUrl: './issue-status.component.css'
})
export class IssueStatusComponent {
  @Input() issue!: JIssue;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  IssueStatusDisplay = IssueStatusDisplay;

  variants = {
    [IssueStatus.BACKLOG]: 'btn-secondary',
    [IssueStatus.SELECTED]: 'btn-secondary',
    [IssueStatus.IN_PROGRESS]: 'btn-primary',
    [IssueStatus.DONE]: 'btn-success'
  };

  issueStatuses!: IssueStatusValueTitle[];
  selectedIssueStatus!: IssueStatus;

  constructor(private _projectService: ProjectService, private _projectQuery: ProjectQuery) {}

  ngOnInit(): void {
    this.issueStatuses = [
      new IssueStatusValueTitle(IssueStatus.BACKLOG),
      new IssueStatusValueTitle(IssueStatus.SELECTED),
      new IssueStatusValueTitle(IssueStatus.IN_PROGRESS),
      new IssueStatusValueTitle(IssueStatus.DONE)
    ];
    this.selectedIssueStatus = this.issue.status;
  }

  updateIssue(status: IssueStatus) {
    const newPosition = this._projectQuery.lastIssuePosition(status);
    this._projectService.updateIssue({
      ...this.issue,
      status,
      listPosition: newPosition + 1
    });
  }

  isStatusSelected(status: IssueStatus) {
    return this.issue.status === status;
  }
}

class IssueStatusValueTitle {
  value: IssueStatus;
  label: string;
  constructor(issueStatus: IssueStatus) {
    this.value = issueStatus;
    this.label = IssueStatusDisplay[issueStatus];
  }
}
