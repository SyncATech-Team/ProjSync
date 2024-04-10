import {ChangeDetectorRef, Component, Input, OnChanges, OnInit} from '@angular/core';
import {IssuePriority, JIssue} from "../../../../_models/issue";
import {IssuePriorityIcon} from "../../../../_models/issue-priority-icon";
import {IssueUtil} from "../../../utils/issue-util";
import {ProjectService} from "../../../state/project/project.service";
import {ProjectConst} from "../../../config/const";
import {OverlayPanel} from "primeng/overlaypanel";

@Component({
  selector: 'issue-priority',
  templateUrl: './issue-priority.component.html',
  styleUrl: './issue-priority.component.css'
})
export class IssuePriorityComponent implements OnInit, OnChanges {
  @Input() issue!: JIssue;

  selectedPriority!: IssuePriority;
  get selectedPriorityIcon() {
    return IssueUtil.getIssuePriorityIcon(this.selectedPriority);
  }

  priorities!: IssuePriorityIcon[];

  constructor(private _projectService: ProjectService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.priorities = ProjectConst.PrioritiesWithIcon;
    this.cdr.markForCheck();
  }

  ngOnChanges(): void {
    this.selectedPriority = this.issue?.priority;
  }

  isPrioritySelected(priority: IssuePriority) {
    return priority === this.selectedPriority;
  }

  updateIssue(priority: IssuePriority, op: OverlayPanel): void {
    this.selectedPriority = priority;
    this._projectService.updateIssue({
      ...this.issue,
      priority: this.selectedPriority
    });
    op.hide();
  }
}
