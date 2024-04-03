import { Component, Input, OnChanges, OnInit, SimpleChanges, input } from '@angular/core';
import { JIssue } from '../../../../_models/issue';
import { JUser } from '../../../../_models/user-issues';
import { IssuePriorityIcon } from '../../../../_models/issue-priority-icon';
import { IssueUtil } from '../../../utils/issue-util';

@Component({
  selector: 'issue-card',
  templateUrl: './issue-card.component.html',
  styleUrl: './issue-card.component.css'
})
export class IssueCardComponent implements OnChanges, OnInit {
  @Input() issue!: JIssue;
  assignees!: JUser[];
  issueTypeIcon!: string;
  priorityIcon!: IssuePriorityIcon;

  constructor(
    // private _projectQuery: ProjectQuery, private _modalService: NzModalService
  ) { }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    const issueChange = changes['issue'];
    if (issueChange?.currentValue !== issueChange.previousValue) {
      this.issueTypeIcon = IssueUtil.getIssueTypeIcon(this.issue.type);
      this.priorityIcon = IssueUtil.getIssuePriorityIcon(this.issue.priority);
    }
  }

  openIssueModal(issueId: string) {
    // this._modalService.create({
    //   nzContent: IssueModalComponent,
    //   nzWidth: 1040,
    //   nzClosable: false,
    //   nzFooter: null,
    //   nzComponentParams: {
    //     issue$: this._projectQuery.issueById$(issueId)
    //   }
    // });
  }

}
