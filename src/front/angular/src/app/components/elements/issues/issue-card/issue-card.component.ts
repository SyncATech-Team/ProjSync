import { Component, Input, OnChanges, OnInit, SimpleChanges, input } from '@angular/core';
import { JIssue } from '../../../../_models/issue';
import { JUser } from '../../../../_models/user-issues';
import { IssuePriorityIcon } from '../../../../_models/issue-priority-icon';
import { IssueUtil } from '../../../utils/issue-util';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { IssueModalComponent } from '../issue-modal/issue-modal.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import {ProjectQuery} from "../../../state/project/project.query";

@UntilDestroy()
@Component({
  selector: 'issue-card',
  templateUrl: './issue-card.component.html',
  styleUrl: './issue-card.component.css'
})
export class IssueCardComponent implements OnChanges, OnInit {
  @Input() issue!: JIssue;
  assignees!: (JUser | undefined)[];
  issueTypeIcon!: string;
  priorityIcon!: IssuePriorityIcon;

  ref: DynamicDialogRef | undefined;

  constructor(private _projectQuery: ProjectQuery, private _modalService: DialogService) { }

  ngOnInit(): void {
    this._projectQuery.users$.pipe(untilDestroyed(this)).subscribe((users) => {
      this.assignees = this.issue.userIds.map((userId) => users.find((x) => x.id === userId));
    });
  }


  ngOnChanges(changes: SimpleChanges): void {
    const issueChange = changes['issue'];
    if (issueChange?.currentValue !== issueChange.previousValue) {
      this.issueTypeIcon = IssueUtil.getIssueTypeIcon(this.issue.type);
      this.priorityIcon = IssueUtil.getIssuePriorityIcon(this.issue.priority);
    }
  }

  openIssueModal(issueId: string) {
    this.ref = this._modalService.open(IssueModalComponent, {
      header: 'Issue - update',
      width: '65%',
      modal:true,
      breakpoints: {
          '960px': '75vw',
          '640px': '90vw'
      },
      data: {
        issue$: this._projectQuery.issueById$(issueId)
      }
    });
  }

}
