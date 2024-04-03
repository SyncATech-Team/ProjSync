import { Component, Input, OnChanges, OnInit, SimpleChanges, input } from '@angular/core';
import { JIssue } from '../../../../_models/issue';
import { JUser } from '../../../../_models/user-issues';
import { IssuePriorityIcon } from '../../../../_models/issue-priority-icon';
import { IssueUtil } from '../../../utils/issue-util';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { IssueModalComponent } from '../issue-modal/issue-modal.component';
import { JProject } from '../../../../_models/project';
import { MockService } from '../../../../_service/mock.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, delay, map, of } from 'rxjs';

@UntilDestroy()
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

  ref: DynamicDialogRef | undefined;

  issues$!: Observable<JIssue[]>
  
  constructor( private _api: MockService, private _modalService: DialogService) { }

  ngOnInit(): void {
    this.getProject();
  }

  getProject() {
    this._api.getProject().pipe(untilDestroyed(this))
      .subscribe((project: JProject) => {
        this.issues$ = of(project.issues);
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
      header: 'Select a Product',
      width: '50vw',
      modal:true,
      breakpoints: {
          '960px': '75vw',
          '640px': '90vw'
      },
      data: {
        issue$: this.issues$.pipe(map((issues) => issues.find(x => x.id === issueId)))
      }
    });
  }

}
