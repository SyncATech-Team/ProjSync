import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { IssueStatus, IssueStatusDisplay, JIssue } from '../../../../_models/issue';
import {ProjectService} from "../../../state/project/project.service";
import {ProjectQuery} from "../../../state/project/project.query";
import {OverlayPanel} from "primeng/overlaypanel";

@Component({
  selector: 'issue-status',
  templateUrl: './issue-status.component.html',
  styleUrl: './issue-status.component.css'
})
export class IssueStatusComponent implements OnInit {
  @Input() issue!: JIssue;
  IssueStatusDisplayMap = IssueStatusDisplay;

  variants = {
    [IssueStatus.BACKLOG]: 'secondary',
    [IssueStatus.SELECTED]: 'secondary',
    [IssueStatus.IN_PROGRESS]: '',
    [IssueStatus.DONE]: 'success'
  };

  issueStatuses!: IssueStatusValueTitle[];

  constructor(private _projectService: ProjectService, private _projectQuery: ProjectQuery,
              private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.issueStatuses = [
      new IssueStatusValueTitle(IssueStatus.BACKLOG),
      new IssueStatusValueTitle(IssueStatus.SELECTED),
      new IssueStatusValueTitle(IssueStatus.IN_PROGRESS),
      new IssueStatusValueTitle(IssueStatus.DONE)
    ];
    this.cdr.markForCheck();
  }

  updateIssue(status: IssueStatus, op: OverlayPanel) {
    const newPosition = this._projectQuery.lastIssuePosition(status);
    this._projectService.updateIssue({
      ...this.issue,
      status,
      listPosition: newPosition + 1

    });
    op.hide();
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
