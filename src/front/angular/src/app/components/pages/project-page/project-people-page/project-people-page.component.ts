import { Component, OnInit, ViewChild } from '@angular/core';
import { UserGetter } from '../../../../_models/user-getter';
import { ActivatedRoute } from '@angular/router';
import { UserOnProjectService } from '../../../../_service/userOnProject.service';
import { CompanyroleService } from '../../../../_service/companyrole.service';
import { CompanyRole } from '../../../../_models/company-role';
import { ConfirmationService } from 'primeng/api';
import { MessagePopupService } from '../../../../_service/message-popup.service';
import { NgForm } from '@angular/forms';
import { UserService } from '../../../../_service/user.service';
import { Project } from '../../../../_models/project.model';
import { ProjectService } from '../../../../_service/project.service';

@Component({
  selector: 'app-project-people-page',
  templateUrl: './project-people-page.component.html',
  styleUrls: ['./project-people-page.component.css'],
  providers: [ConfirmationService]
})
export class ProjectPeoplePageComponent implements OnInit{
  private MAX_NUMBER_OF_DEFAULT_IMAGES: number = 10;
  users: UserGetter[] = [];
  users_backup : UserGetter[] = [];
  allUsers: UserGetter[] = [];
  project: Project | null = null;

  userRole : CompanyRole[] = [];
  selectedRole: string = '';
    
  projectName: string = '';
  projectType: string = '';
  projectKey: string = '';

  searchTerm: string = '';
  color: string = '#ff0000';

  userForAdd: string = '';
  selectedColumns!: string[];
  columns!: string[];

  @ViewChild('createRoleForm') formRecipe?: NgForm;

  constructor(
    private route: ActivatedRoute, 
    private userOnProjectService: UserOnProjectService, 
    private companyRole: CompanyroleService,
    private confirmationService: ConfirmationService,
    private msgPopupService: MessagePopupService,
    private userService: UserService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.columns = ['Email address','Firstname','Lastname','Role','Address','Contact phone','Status'];
    this.selectedColumns = ['Email address','Firstname','Lastname','Role'];
    this.projectName = this.route.snapshot.paramMap.get('projectName')!;
    this.initialize();
  }

  initialize(): void {
    this.userOnProjectService.getAllUsersOnProject(this.projectName).subscribe({
      next: (response) => {
        this.users = response;
        this.users_backup = response;
      },
      error: (error) => {
        console.log(error);
      }
    });

    this.companyRole.getAllCompanyRoles().subscribe({
      next: (response) => {
        this.userRole = response;
      },
      error: (error) => {
        console.log(error);
      }
    });

    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.allUsers = response.filter(user => user.username !== 'admin');
      },
      error: (error) => {
        console.log(error);
      }
    });

    this.projectService.getProjectByName(this.projectName).subscribe({
      next: (response) => {
        this.project = response;
        this.projectType = this.project.typeName;
        this.projectKey = this.project.key;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getUserImagePath(username: string) {
    var index = this.users.findIndex(user => user.username === username);
    if(index == -1) return "../../../../../assets/images/DefaultAccountProfileImages/default_account_image_1.png";
    var user = this.users[index];
    let path = "";

    if(user.profilePhoto == null) {
      let usernameSumOfCharacters: number = 0;
      for (let index = 0; index < username.length; index++) {
        usernameSumOfCharacters += username.charCodeAt(index);
      }

      let defaultImageNumber = usernameSumOfCharacters % this.MAX_NUMBER_OF_DEFAULT_IMAGES + 1;
      path = "../../../../../assets/images/DefaultAccountProfileImages/default_account_image_" 
          + defaultImageNumber + ".png";
    }
    else {
      path = "../../../../../assets/images/UserProfileImages/" + user.profilePhoto;
    }
    return path;
  }

  search() {
    let searchTerm = this.searchTerm.toLowerCase().trim();
    let filteredUsers = [...this.users_backup];
  
    if (this.selectedRole && (this.selectedRole as any).name) {
      filteredUsers = filteredUsers.filter(user => user.companyRoleName === (this.selectedRole as any).name);
    }
  
    if (searchTerm) {
      filteredUsers = filteredUsers.filter(user => user.username.toLowerCase().includes(searchTerm));
    }
    
    this.users = filteredUsers;
  }
  
  deleteUserFromProject(event: Event, username: string) {

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass:"p-button-danger p-button-text",
      rejectButtonStyleClass:"p-button-text p-button-text",
      acceptIcon:"none",
      rejectIcon:"none",

      accept: (input: string) => {
        this.userOnProjectService.removeUserFromProject(this.projectName, username).subscribe({
          next: _ => {
            const indexToRemove = this.users.findIndex(user => user.username === username);
            if (indexToRemove !== -1) {
              this.users.splice(indexToRemove, 1);
            }
    
            const indexToRemoveBackup = this.users_backup.findIndex(user => user.username === username);
            if(indexToRemoveBackup !== -1) {
              this.users_backup.splice(indexToRemoveBackup, 1);
            }
            this.msgPopupService.showSuccess("User removed from project successfully.");
          },
          error: error => {
            this.msgPopupService.showError("Unable to delete choosen user.");
            console.log(error);
          }
        });
      },
      reject: () => {
          this.msgPopupService.showError('You have rejected');
      }
    });
  }

  addUser() {
    this.userOnProjectService.addUserOnProject(this.projectName, (this.userForAdd as any).username, this.color).subscribe({
      next: (response) => {
        this.msgPopupService.showSuccess("Successfully added new user!");
        this.userForAdd = "";

        console.log(this.color);        
        this.userOnProjectService.getAllUsersOnProject(this.projectName).subscribe({
          next: (response) => {
            this.users = response;
            this.users_backup = response;
          },
          error: (error) => {
            console.log(error);
          }
        });
      },
      error: (error) => {
        this.msgPopupService.showError("Unable to add new user! Make sure there are no duplicate names.")
      }
    })
  }

}