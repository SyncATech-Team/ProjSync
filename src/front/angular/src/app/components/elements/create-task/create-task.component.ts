import { Component, Input, OnInit } from '@angular/core';
import { IssueService } from '../../../_service/issue.service';
import { ActivatedRoute } from '@angular/router';
import { quillConfiguration } from '../../../config/editor';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IssueGroup } from '../../../_models/issue-group';
import { UserService } from '../../../_service/user.service';
import { UserGetter } from '../../../_models/user-getter';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent implements OnInit {
  projectName: string | null = '';
  groupsOnProject: IssueGroup [] = [];
  users : UserGetter[] = [];

  constructor(
    private route: ActivatedRoute,
    private _modal: DynamicDialogRef,
    private _dialogConfig: DynamicDialogConfig,
    private _issueService: IssueService,
    private userService : UserService
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
    
      this.userService.getAllUsers().subscribe({
        next: (response) => {
          this.users = response.filter(user => user.username !== 'admin');
        },
        error: (error) => {
          console.log(error);
        }
      });
  }
}
