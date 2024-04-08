import { Component, Input, OnInit } from '@angular/core';
import { IssueService } from '../../../_service/issue.service';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IssueGroup } from '../../../_models/issue-group';
import { UserService } from '../../../_service/user.service';
import { UserGetter } from '../../../_models/user-getter';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IssueType } from '../../../_models/issue-type';
import { IssuePriority } from '../../../_models/issue-prioritys';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent implements OnInit {
  form : FormGroup;

  projectName: string | null = '';
  users : UserGetter[] = [];
  groupsOnProject: IssueGroup [] = [];
  issueTypes : IssueType[] = [];
  issuePrioritys : IssuePriority[] = [];

  constructor(
    private route: ActivatedRoute,
    private _modal: DynamicDialogRef,
    private _dialogConfig: DynamicDialogConfig,
    private _issueService: IssueService,
    private userService : UserService,
    private formBuilder: FormBuilder
  ) { 
    this.form = this.formBuilder.group({
      'issue-group': [''],
      'issue-name' : [],
      'issue-type' : [],
      'issue-priority' : [],
      'issue-description' : [],
      'issue-create-date' : [],
      'issue-due-date' : [],
      'issue-status' : [],
      'issue-reporter' : [],
      'issue-assigner' : []
    });
  }

  ngOnInit(): void {
    this.projectName = this._dialogConfig.data.projectName;
    if(this.projectName)
      this._issueService.getAllGroups(this.projectName).subscribe({
        next: (response) => {
          this.groupsOnProject = response;
        },
        error: (error) => {
          console.log(error);
        }
      });
    
      this.userService.getAllUsers().subscribe({
        next: (response) => {
          this.users = response.filter(user => user.username !== 'admin');
        },
        error: (error) => {
          console.log(error);
        }
      });

      this._issueService.getAllIssueTypes().subscribe({
        next: (response) => {
          this.issueTypes = response;
        },
        error: (error) => {
          console.log(error);
        }
      });

      this._issueService.getAllIssuePrioritys().subscribe({
        next: (response) => {
          this.issuePrioritys = response;
        },
        error: (error) => {
          console.log(error);
        }
      })
  }
}
