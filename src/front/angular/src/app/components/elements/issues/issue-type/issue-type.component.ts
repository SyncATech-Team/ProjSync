import { Component, Input } from '@angular/core';
import { IssuePriority, IssueType, JIssue } from '../../../../_models/issue';
import { IssueTypeWithIcon } from '../../../../_models/issue-type-icon';
import { IssueUtil } from '../../../utils/issue-util';
import { IssuePriorityIcon } from '../../../../_models/issue-priority-icon';

@Component({
  selector: 'issue-type',
  templateUrl: './issue-type.component.html',
  styleUrl: './issue-type.component.css'
})
export class IssueTypeComponent {
  @Input() issue!: JIssue;

  selectedissueType!: IssueType;
  issueTypes: IssueTypeWithIcon[];

  constructor() {
    this.issueTypes = ProjectConst.IssueTypesWithIcon;
  }

  get selectedIssueTypeIcon(): string {
    return IssueUtil.getIssueTypeIcon(this.issue.type);
  }

  ngOnInit() {
    this.selectedissueType = this.issue.type;
  }

  ngOnChanges(): void {}

  updateIssue(issueType: IssueType) {
    // this._projectService.updateIssue({
    //   ...this.issue,
    //   type: issueType
    // });
  }

  isTypeSelected(type: IssueType) {
    return this.issue.type === type;
  }
}

class ProjectConst {
  static readonly IssueId = 'issueId';
  static readonly Projects = 'Projects';
  static PrioritiesWithIcon: IssuePriorityIcon[] = [
    IssueUtil.getIssuePriorityIcon(IssuePriority.LOWEST),
    IssueUtil.getIssuePriorityIcon(IssuePriority.LOW),
    IssueUtil.getIssuePriorityIcon(IssuePriority.MEDIUM),
    IssueUtil.getIssuePriorityIcon(IssuePriority.HIGH),
    IssueUtil.getIssuePriorityIcon(IssuePriority.HIGHEST)
  ];

  static IssueTypesWithIcon: IssueTypeWithIcon[] = [
    new IssueTypeWithIcon(IssueType.BUG),
    new IssueTypeWithIcon(IssueType.STORY),
    new IssueTypeWithIcon(IssueType.TASK)
  ];
}
