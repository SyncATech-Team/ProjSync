import { Component, Input, OnInit } from '@angular/core';
import { IssueService } from '../../../_service/issue.service';
import { ActivatedRoute } from '@angular/router';
import { quillConfiguration } from '../../../config/editor';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IssueGroup } from '../../../_models/issue-group';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent implements OnInit {
  projectName: string | null = '';
  groupsOnProject: IssueGroup [] = [];

  constructor(
    private route: ActivatedRoute,
    private _modal: DynamicDialogRef,
    private _dialogConfig: DynamicDialogConfig,
    private _issueService: IssueService
  ) { }

  ngOnInit(): void {
    this.projectName = this._dialogConfig.data.projectName;
    if(this.projectName)
      this._issueService.getAllGroups(this.projectName).subscribe({
        next: (response) => {
          this.groupsOnProject = response;
          console.log(this.groupsOnProject);
        },
        error: (error) => {
          console.log(error);
        }
        
      });
  }
}
