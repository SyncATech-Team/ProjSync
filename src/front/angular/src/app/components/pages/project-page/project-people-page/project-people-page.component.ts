import { Component, OnInit, ViewChild } from '@angular/core';
import { UserGetter } from '../../../../_models/user-getter';
import { ActivatedRoute } from '@angular/router';
import { UserOnProjectService } from '../../../../_service/userOnProject.service';
import { CompanyroleService } from '../../../../_service/companyrole.service';
import { CompanyRole } from '../../../../_models/company-role';
import { ConfirmationService } from 'primeng/api';
import { MessagePopupService } from '../../../../_service/message-popup.service';
import { Table } from 'primeng/table';

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
  userRole : CompanyRole[] = [];
  selectedRole: string = '';
    
  projectName: string = '';
  searchTerm: string = '';

  @ViewChild(Table) table!:Table;

  constructor(
    private route: ActivatedRoute, 
    private userOnProjectService: UserOnProjectService, 
    private companyRole: CompanyroleService,
    private confirmationService: ConfirmationService,
    private msgPopupService: MessagePopupService
  ) {}

  ngOnInit(): void {
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
  }

  getUserImagePath(username: string) {
    let usernameSumOfCharacters: number = 0;
    for (let index = 0; index < username.length; index++) {
      usernameSumOfCharacters += username.charCodeAt(index);
    }

    let defaultImageNumber = usernameSumOfCharacters % this.MAX_NUMBER_OF_DEFAULT_IMAGES + 1;
    let path: string = "../../../../../assets/images/DefaultAccountProfileImages/default_account_image_" + defaultImageNumber + ".png";

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
    // const response = prompt("In order to delete role please enter [" + argRole.name + "]");
    // if(response != argRole.name) return;

    // console.log(argRole);

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
}