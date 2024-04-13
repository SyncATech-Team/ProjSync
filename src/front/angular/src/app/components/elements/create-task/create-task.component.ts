import { Component, Input, OnInit } from '@angular/core';
import { IssueService } from '../../../_service/issue.service';
import { ActivatedRoute } from '@angular/router';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserGetter } from '../../../_models/user-getter';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IssueType } from '../../../_models/issue-type';
import { IssuePriority } from '../../../_models/issue-prioritys';
import { MessagePopupService } from '../../../_service/message-popup.service';
import { IssueStatus } from '../../../_models/issue-status';
import { CreateGroupComponent } from '../create-group/create-group.component';
import { MessageService } from 'primeng/api';
import { AccountService } from '../../../_service/account.service';
import { GroupInProject } from '../../../_models/group-in-project';
import { GroupService } from '../../../_service/group.service';
import { UserOnProjectService } from '../../../_service/userOnProject.service';
import { CreateIssueModel } from '../../../_models/create-issue.model';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent implements OnInit {
  form : FormGroup;
  ref: DynamicDialogRef | undefined;

  projectName: string | null = '';
  users : UserGetter[] = [];
  groupsOnProject: GroupInProject [] = [];
  issueTypes : IssueType[] = [];
  issuePrioritys : IssuePriority[] = [];
  issueStatus : IssueStatus[] = [];

  selectedAssignees : UserGetter[] = [];
  currentUser? : string;

  issueCreator : CreateIssueModel = {
    name: "",
    typeName: "",
    statusName: "",
    priorityName: "",
    description: "",
    createdDate: new Date(),
    updatedDate: new Date(),
    dueDate: new Date(),
    ownerUsername: "",
    reporterUsername: "",
    assigneeUsernames: [],
    dependentOnIssues: [],
    projectName: "",
    groupName: "",
    completed: 0
  }

  constructor(
    private route : ActivatedRoute,
    private _modal : DynamicDialogRef,
    private _dialogConfig : DynamicDialogConfig,
    private _issueService: IssueService,
    private userOnProject : UserOnProjectService,
    private formBuilder : FormBuilder,
    private msgPopUpService : MessagePopupService,
    private messageService: MessageService,
    public dialogService: DialogService,
    private accountServis: AccountService,
    private groupService: GroupService
  ) { 
    this.currentUser = this.accountServis.getCurrentUser()?.username;
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
      this.groupService.getAllGroups(this.projectName).subscribe({
        next: (response) => {
          this.groupsOnProject = response;
        },
        error: (error) => {
          console.log(error);
        }
      });
    
    if(this.projectName)
      this.userOnProject.getAllUsersOnProject(this.projectName).subscribe({
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

      this._issueService.getAllIssueStatus().subscribe({
        next: (response) => {
          this.issueStatus = response;
        },
        error: (error) => {
          console.log(error);
        }
      });
  }

  onSubmit() {
    // console.log(this.form.controls['issue-status'].value.name);
    if(this.projectName){

      try {
        this.issueCreator.name = this.form.controls['issue-name'].value;
        this.issueCreator.typeName = this.form.controls['issue-type'].value.name;
        this.issueCreator.statusName = this.form.controls['issue-status'].value;
        this.issueCreator.priorityName = this.form.controls['issue-priority'].value.name;
        this.issueCreator.description = this.form.controls['issue-description'].value;
        this.issueCreator.createdDate = this.form.controls['issue-create-date'].value;
        this.issueCreator.updatedDate = new Date();
        this.issueCreator.dueDate = this.form.controls['issue-due-date'].value;
        this.issueCreator.ownerUsername = this.currentUser!;
        this.issueCreator.reporterUsername = this.form.controls['issue-reporter'].value.username;
        const assignedToUsernames = this.selectedAssignees.map(user => user.username);
        this.issueCreator.assigneeUsernames = assignedToUsernames;
        this.issueCreator.dependentOnIssues = [];  // ZA SADA PRAZAN STRING TREBA OMOGUCITI I BIRANJE ZAVISNOSTI
        this.issueCreator.projectName = this.projectName;
        this.issueCreator.groupName = this.form.controls['issue-group'].value.name;
        this.issueCreator.statusName = this.form.controls['issue-status'].value.name;

        if(this.issueCreator.dueDate < this.issueCreator.createdDate){
          this.msgPopUpService.showError("Unable to create task, due date is before creation date");
        }
        else{
          this._issueService.createIssue(this.issueCreator).subscribe({
            next : (response) => {
              this.msgPopUpService.showSuccess("Task successfully created");
              this._modal.close();
            },
            error : (error) => {
              console.log(error);
            }
          })
        }
      }
      catch(error) {
        this.msgPopUpService.showError("Unable to create task!");
      }
    }
  }

  closeModal() {
    this._modal.close();
  }

  showCreateGroupPopUp(){
    this.ref = this.dialogService.open(CreateGroupComponent, {
      header: 'Create Group',
      width: '30%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      closable: true,
      modal: true,
      dismissableMask: true,
      closeOnEscape: true,
      data: {
        projectName: this.projectName,
      }
    });
  
    this.ref.onClose.subscribe((data: any) => {
      this.ngOnInit();
    });
  }
}