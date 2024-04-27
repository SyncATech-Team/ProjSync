import {Component, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {UsersWithCompletion} from "../../../../_models/user-completion-level";
import {ProjectService} from "../../../state/project/project.service";

@Component({
  selector: 'app-issue-change-progress',
  templateUrl: './issue-change-progress.component.html',
  styleUrl: './issue-change-progress.component.css'
})
export class IssueChangeProgressComponent implements OnInit {
  issueId!: string;
  userId!: string;
  userName!: string;
  currentCompletionLevel: number = 0;

  sliderValue: number = 0;

  constructor(private _modal: DynamicDialogRef, private _dialogConfig: DynamicDialogConfig,
              private _projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.issueId = this._dialogConfig.data.issueId;
    this.userId = this._dialogConfig.data.userId;
    this.userName = this._dialogConfig.data.userName;
    this.currentCompletionLevel = this._dialogConfig.data.currentCompletionLevel;

    this.sliderValue = this.currentCompletionLevel;
  }

  changeProgress() {
    if (this.sliderValue < 0) this.sliderValue = 0;
    if (this.sliderValue > 100) this.sliderValue = 100;
    let userOnIssue: UsersWithCompletion = {
      id: this.userId,
      userId: this.userId,
      completionLevel: this.sliderValue,
    }
    if (this.sliderValue !== this.currentCompletionLevel) {
      this._projectService.updateUsersOnIssueCompleteLevel(this.issueId, userOnIssue);
      this._modal.close();
    }
    this._modal.close();
  }
}
