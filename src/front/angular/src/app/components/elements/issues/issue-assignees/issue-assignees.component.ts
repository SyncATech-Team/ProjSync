import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {UntilDestroy} from "@ngneat/until-destroy";
import {JIssue} from "../../../../_models/issue";
import {JUser} from "../../../../_models/user-issues";
import {ProjectService} from "../../../state/project/project.service";

@Component({
  selector: 'issue-assignees',
  templateUrl: './issue-assignees.component.html',
  styleUrl: './issue-assignees.component.css'
})
@UntilDestroy()
export class IssueAssigneesComponent implements OnInit, OnChanges {
  @Input() issue!: JIssue;
  @Input() users!: JUser[] | null;
  assignees!: (JUser | undefined)[];

  constructor(private _projectService: ProjectService) {}

  ngOnInit(): void {
    if (this.users) {
      // @ts-ignore
      this.assignees = this.issue.userIds.map((userId) => this.users.find((x) => x.id === userId));
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const issueChange = changes['issue'];
    if (this.users && issueChange.currentValue !== issueChange.previousValue) {
      // @ts-ignore
      this.assignees = this.issue.userIds.map((userId) => this.users.find((x) => x.id === userId));
    }
  }

  removeUser(userId: string | undefined) {
    const newUserIds = this.issue.userIds.filter((x) => x !== userId);
    this._projectService.updateIssue({
      ...this.issue,
      userIds: newUserIds
    });
  }

  addUserToIssue(user: JUser) {
    this._projectService.updateIssue({
      ...this.issue,
      userIds: [...this.issue.userIds, user.id]
    });
  }

  isUserSelected(user: JUser): boolean {
    return this.issue.userIds.includes(user.id);
  }
}
