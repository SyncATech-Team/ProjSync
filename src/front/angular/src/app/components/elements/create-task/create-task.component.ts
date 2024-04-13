import { Component, Input, OnInit } from '@angular/core';
import { IssueService } from '../../../_service/issue.service';
import { ActivatedRoute } from '@angular/router';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserService } from '../../../_service/user.service';
import { UserGetter } from '../../../_models/user-getter';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IssueType } from '../../../_models/issue-type';
import { IssuePriority, JIssue } from '../../../_models/issue';
import { IssuesInGroup } from '../../../_models/issues-in-group';
import { MessagePopupService } from '../../../_service/message-popup.service';
import { IssueStatus } from '../../../_models/issue-status';
import { CreateGroupComponent } from '../create-group/create-group.component';
import { MessageService } from 'primeng/api';
import { AccountService } from '../../../_service/account.service';
import { GroupInProject } from '../../../_models/group-in-project';
import { GroupService } from '../../../_service/group.service';
import { UserOnProjectService } from '../../../_service/userOnProject.service';
import { PhotoForUser } from '../../../_models/photo-for-user';
import { UserProfilePicture } from '../../../_service/userProfilePicture.service';
import { IssueUtil } from '../../utils/issue-util';
import { IssuePriorityIcon } from '../../../_models/issue-priority-icon';
import { ProjectConst } from '../../config/const';

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
  // issuePrioritys : IssuePriority[] = [];
  issueStatus : IssueStatus[] = [];
  usersPhotos: PhotoForUser[] = [];

  selectedAssignees : UserGetter[] = [];
  currentUser? : string;

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
    dependentOn: null,
    assignedTo: [],
    issueOwner: ""
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
    private groupService: GroupService,
    private userPictureService: UserProfilePicture
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

  jIssue!: JIssue;
  selectedPriority!: IssuePriority;
  get selectedPriorityIcon() {
    return IssueUtil.getIssuePriorityIcon(this.selectedPriority);
  }

  priorities!: IssuePriorityIcon[];

  isPrioritySelected(priority: IssuePriority) {
    return priority === this.selectedPriority;
  }

  ngOnInit(): void {
    this.priorities = ProjectConst.PrioritiesWithIcon;
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
          this.getUserProfilePhotos(this.users);
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
      this.issue.projectName = this.projectName;
      this.issue.name = this.form.controls['issue-name'].value;
      this.issue.groupName = this.form.controls['issue-group'].value.name;
      this.issue.priorityName = this.form.controls['issue-priority'].value.name;
      this.issue.typeName = this.form.controls['issue-type'].value.name;
      this.issue.statusName = this.form.controls['issue-status'].value;
      this.issue.description = this.form.controls['issue-description'].value;
      this.issue.createdDate = this.form.controls['issue-create-date'].value;
      this.issue.dueDate = this.form.controls['issue-due-date'].value;
      this.issue.statusName = this.form.controls['issue-status'].value.name;
      this.issue.reporterUsername = this.form.controls['issue-reporter'].value.username;
      this.issue.dependentOn = null;
      this.issue.updatedDate = new Date();
      if(this.currentUser)
        this.issue.issueOwner = this.currentUser;
      
      const assignedToUsernames = this.selectedAssignees.map(user => user.username);
      this.issue.assignedTo = assignedToUsernames;

      console.log(this.issue);

      if(this.issue.dueDate < this.issue.createdDate){
        this.msgPopUpService.showError("Unable to create project, due date is before creation date");
      }
      else{
        this._issueService.createIssue(this.issue).subscribe({
          next : (response) => {
            this.msgPopUpService.showSuccess("Project successfully created");
            this._modal.close();
          },
          error : (error) => {
            console.log(error);
          }
        })
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

  getUserProfilePhotos(users: UserGetter[]) {
    for(const user of users) {
      if(user.profilePhoto != null) {
        this.userPictureService.getUserImage(user.username).subscribe({
          next: response => {
            let path = response['fileContents'];
            path = this.userPictureService.decodeBase64Image(response['fileContents']);
            var ph: PhotoForUser = {
              username: user.username, 
              photoSource: path
            };
            this.usersPhotos.push(ph);
          },
          error: error => {
            console.log(error);
          }
        });
      }
      else {
        var ph: PhotoForUser = {
          username: user.username,
          photoSource: "SLIKA_JE_NULL"
        }
        this.usersPhotos.push(ph);
      }
    }
  }

  getUserImagePath(username: string,users: UserGetter[]) {
    let index = users.findIndex(u => u.username === username);
    if(index == -1) return this.userPictureService.getFirstDefaultImagePath();

    if(users[index].profilePhoto == null)
      return this.userPictureService.getDefaultImageForUser(users[index].username);

    let ind = this.usersPhotos.findIndex(u => u.username == username);
    if(ind == -1) return this.userPictureService.getFirstDefaultImagePath();
    return this.usersPhotos[ind].photoSource;
  }
}