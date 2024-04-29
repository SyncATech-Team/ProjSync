import { Component, Input, OnInit } from '@angular/core';
import { IssueService } from '../../../_service/issue.service';
import { ActivatedRoute } from '@angular/router';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserGetter } from '../../../_models/user-getter';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IssueType } from '../../../_models/issue-type';
import { IssuePriority, JIssue } from '../../../_models/issue';
import { MessagePopupService } from '../../../_service/message-popup.service';
import { IssueStatus } from '../../../_models/issue-status';
import { CreateGroupComponent } from '../create-group/create-group.component';
import { AccountService } from '../../../_service/account.service';
import { GroupInProject } from '../../../_models/group-in-project';
import { GroupService } from '../../../_service/group.service';
import { UserOnProjectService } from '../../../_service/userOnProject.service';
import { PhotoForUser } from '../../../_models/photo-for-user';
import { UserProfilePicture } from '../../../_service/userProfilePicture.service';
import { IssuePriorityIcon } from '../../../_models/issue-priority-icon';
import { ProjectConst } from '../../config/const';
import { CreateIssueModel } from '../../../_models/create-issue.model';
import { IssueTypeWithIcon } from '../../../_models/issue-type-icon';

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
  // issueTypes : IssueType[] = [];
  // issuePrioritys : IssuePriority[] = [];
  issueStatus : IssueStatus[] = [];
  usersPhotos: PhotoForUser[] = [];
  currentUser? : string;

  issueCreator : CreateIssueModel = {
    name: "",
    typeName: "",
    statusName: "",
    priorityName: "",
    description: "",
    createdDate: null!,
    updatedDate: new Date(),
    dueDate: null!,
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
  selectedPriorityModel! : IssuePriorityIcon;
  priorities!: IssuePriorityIcon[];

  issueTypes!: IssueTypeWithIcon[];
  selectedIssueType!: IssueTypeWithIcon;

  ngOnInit(): void {
    this.issueTypes = ProjectConst.IssueTypesWithIcon;
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

      // this._issueService.getAllIssueTypes().subscribe({
      //   next: (response) => {
      //     this.issueTypes = response;
      //   },
      //   error: (error) => {
      //     console.log(error);
      //   }
      // });

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
        // PROVERA NAZIVA
        if(this.issueCreator.name == null || this.issueCreator.name == ""){
          this.msgPopUpService.showError("Unable to create task, task name is empty");
          return;
        }

        this.selectedIssueType = this.form.controls['issue-type'].value;
        // PROVERA TIPA
        if(this.selectedIssueType == null){
          this.msgPopUpService.showError("Unable to create task, task type is empty");
          return;
        }
        this.issueCreator.typeName = this.selectedIssueType.value;
        
        this.selectedPriorityModel = this.form.controls['issue-priority'].value;
        // PROVERA PRIORITETA
        if(this.selectedPriorityModel == null){
          this.msgPopUpService.showError("Unable to create task, task priority is empty");
          return;
        }
        this.issueCreator.priorityName = this.selectedPriorityModel.value;

        //PROVERA STATUSA
        if(this.form.controls['issue-status'].value == null){
          this.msgPopUpService.showError("Unable to create task, task status is empty");
          return;
        }  
        this.issueCreator.statusName = this.form.controls['issue-status'].value.name;      
        this.issueCreator.description = this.form.controls['issue-description'].value;
        if(this.form.controls['issue-create-date'].value == null){
          this.msgPopUpService.showError("Unable to create task, start date is empty");
          return;
        }
        this.issueCreator.createdDate = this.form.controls['issue-create-date'].value;
        this.issueCreator.createdDate = new Date(Date.UTC(this.issueCreator.createdDate.getFullYear(), this.issueCreator.createdDate.getMonth(), this.issueCreator.createdDate.getDate()));
        this.issueCreator.updatedDate = new Date();
        if(this.form.controls['issue-due-date'].value == null){
          this.msgPopUpService.showError("Unable to create task, due date is empty");
          return;
        }
        this.issueCreator.dueDate = this.form.controls['issue-due-date'].value;
        this.issueCreator.ownerUsername = this.currentUser!;
        if(this.form.controls['issue-reporter'].value == null){
          this.msgPopUpService.showError("Unable to create task, reporter is not selected");
          return;
        }
        this.issueCreator.reporterUsername = this.form.controls['issue-reporter'].value.username;
        if(this.form.controls['issue-assigner'].value == null){
          this.msgPopUpService.showError("Unable to create task, assignee is not selected");
          return;
        }
        this.issueCreator.assigneeUsernames = this.form.controls['issue-assigner'].value.map((user: UserGetter) => user.username);
        this.issueCreator.dependentOnIssues = [];  // ZA SADA PRAZAN STRING TREBA OMOGUCITI I BIRANJE ZAVISNOSTI
        this.issueCreator.projectName = this.projectName;
        this.issueCreator.groupName = this.form.controls['issue-group'].value.name;

        if(this.issueCreator.dueDate < this.issueCreator.createdDate){
          this.msgPopUpService.showError("Unable to create task, due date is before creation date");
        }
        else{
          this._issueService.createIssue(this.issueCreator).subscribe({
            next : (response) => {
              this.msgPopUpService.showSuccess("Task successfully created");
              this.closeModal("created-task");
            },
            error : (error) => {
              if(error.error.message == "A task cannot be created because its creation date is before the project creation date"){
                this.msgPopUpService.showError("A task cannot be created because its creation date is before the project creation date");
              }
            }
          })
        }
      }
      catch(error) {
        this.msgPopUpService.showError("Unable to create task!");
      }
    }
  }

  closeModal(param: string) {
    this._modal.close(param);
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
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      data: {
        projectName: this.projectName,
      }
    });

    this.ref.onClose.subscribe((data: any) => {
      if(data != "created-group") return;     // NE REFRESHUJ MODAL ZA KREIRANJE ZADATKA UKOLIKO NIJE DODATA GRUPA

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
