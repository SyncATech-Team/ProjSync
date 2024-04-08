import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { JIssue } from "../../../../_models/issue";
import { JUser } from "../../../../_models/user-issues";
import { ProjectService } from "../../../state/project/project.service";
import { OverlayPanel } from "primeng/overlaypanel";

@Component({
  selector: 'issue-reporter',
  templateUrl: './issue-reporter.component.html',
  styleUrl: './issue-reporter.component.css'
})
export class IssueReporterComponent implements OnInit, OnChanges {
  @Input() issue!: JIssue;
  @Input() users!: JUser[] | null;
  reporter: JUser | undefined;

  constructor(private _projectService: ProjectService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cdr.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges) {
    const issueChange = changes['issue'];
    if (this.users && issueChange.currentValue !== issueChange.previousValue) {
      this.reporter = this.users.find((x) => x.id === this.issue.reporterId);
    }
  }

  isUserSelected(user: JUser) {
    return user.id === this.issue.reporterId;
  }

  updateIssue(user: JUser, op: OverlayPanel) {
    this._projectService.updateIssue({
      ...this.issue,
      reporterId: user.id
    });
    op.hide();
  }
}
