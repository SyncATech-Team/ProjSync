import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { IssueType, JIssue } from '../../../../_models/issue';
import { IssueTypeWithIcon } from '../../../../_models/issue-type-icon';
import { IssueUtil } from '../../../utils/issue-util';
import { ProjectConst } from '../../../config/const';
import {ProjectService} from "../../../state/project/project.service";
import {OverlayPanel} from "primeng/overlaypanel";

@Component({
  selector: 'issue-type',
  templateUrl: './issue-type.component.html',
  styleUrl: './issue-type.component.css'
})
export class IssueTypeComponent implements OnInit, OnChanges {
  @Input() issue!: JIssue;
  @Input() canManageTask!: string;

  issueTypes: IssueTypeWithIcon[];

  constructor(private _projectService: ProjectService, private cdr: ChangeDetectorRef) {
    this.issueTypes = ProjectConst.IssueTypesWithIcon;
  }

  get selectedIssueTypeIcon(): string {
    return IssueUtil.getIssueTypeIcon(this.issue.type);
  }

  ngOnInit() {
    this.cdr.markForCheck();
  }

  ngOnChanges(): void {}

  updateIssue(issueType: IssueType, op: OverlayPanel) {
    this._projectService.updateIssue({
      ...this.issue,
      type: issueType
    });
    op.hide();
  }

  isTypeSelected(type: IssueType) {
    return this.issue.type === type;
  }
}
