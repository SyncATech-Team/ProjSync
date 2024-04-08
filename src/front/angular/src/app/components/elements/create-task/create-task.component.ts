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
import { IssuesInGroup } from '../../../_models/issues-in-group';

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

  issue : IssuesInGroup = {
    name: "",
    typeName: "",
    statusName: "",
    priorityName: "",
    description: "",
    createdDate: new Date(),
    updatedDate: new Date(),
    dueDate: new Date(),
    reporterUsername: "",
    groupName: "",
    projectName: "",
    dependentOn: "",
    assignetTo: ""
  }

  constructor(
    private route: ActivatedRoute,
    private _modal: DynamicDialogRef,
    private _dialogConfig: DynamicDialogConfig,
    private _issueService: IssueService,
    private userService : UserService,
    private formBuilder: FormBuilder
  ) { 
    this.form = this.formBuilder.group({
      'issue-group': [],
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

  onSubmit() {
    // console.log(this.form.controls['issue-type'].value.name);
    if(this.projectName){
      this.issue.projectName = this.projectName;
      this.issue.name = this.form.controls['issue-name'].value;
      this.issue.groupName = this.form.controls['issue-group'].value;
      this.issue.priorityName = this.form.controls['issue-priority'].value;
      this.issue.statusName = this.form.controls['issue-status'].value;
      this.issue.description = this.form.controls['issue-description'].value;
      this.issue.createdDate = this.form.controls['issue-create-date'].value;
      this.issue.dueDate = this.form.controls['issue-due-date'].value;
      this.issue.statusName = this.form.controls['issue-status'].value;
      this.issue.reporterUsername = this.form.controls['issue-reporter'].value.username;
      this.issue.dependentOn = "";
      this.issue.updatedDate = new Date();
      this.issue.assignetTo = this.form.controls['issue-assigner'].value.username;

      console.log(this.issue);
    }
  }
}
