import { Component, OnInit, ViewChild } from '@angular/core';
import { UserGetter } from '../../../../_models/user-getter';
import { ActivatedRoute } from '@angular/router';
import { UserOnProjectService } from '../../../../_service/userOnProject.service';
import { CompanyroleService } from '../../../../_service/companyrole.service';
import { ConfirmationService } from 'primeng/api';
import { MessagePopupService } from '../../../../_service/message-popup.service';
import { NgForm } from '@angular/forms';
import { UserService } from '../../../../_service/user.service';
import { Project } from '../../../../_models/project.model';
import { ProjectService } from '../../../../_service/project.service';
import { UserProfilePicture } from '../../../../_service/userProfilePicture.service';
import { PhotoForUser } from '../../../../_models/photo-for-user';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserProfileComponent } from '../../../elements/user-profile/user-profile.component';
import { TranslateService } from '@ngx-translate/core';

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

  userRole : string[] = [];
  selectedRole: string = '';
    
  projectName: string = '';
  projectType: string = '';
  projectKey: string = '';

  searchTerm: string = '';
  color: string = '#ff0000';

  userForAdd: string = '';
  selectedColumns!: string[];
  columns!: string[];
  showColumns!: string[];

  usersPhotos: PhotoForUser[] = [];
  ref: DynamicDialogRef | undefined;

  @ViewChild('createRoleForm') formRecipe?: NgForm;

  constructor(
    private route: ActivatedRoute, 
    private userOnProjectService: UserOnProjectService, 
    private companyRole: CompanyroleService,
    private confirmationService: ConfirmationService,
    private msgPopupService: MessagePopupService,
    private userService: UserService,
    private projectService: ProjectService,
    private userPictureService: UserProfilePicture,
    private dialogService : DialogService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.columns = ['Email address','Firstname','Lastname','Role','Address','Contact phone','Status'];
    this.selectedColumns = ['Email address','Firstname','Lastname','Role'];
    this.showColumns = ['Username',...this.selectedColumns,''];
    this.projectName = this.route.snapshot.paramMap.get('projectName')!;
    this.initialize();
  }

  initialize(): void {
    this.userOnProjectService.getAllUsersOnProject(this.projectName).subscribe({
      next: (response) => {
        
        this.users = response.filter(user => user.isActive == true);
        this.users_backup = response;
        const uniqueRoles = new Set(this.users.map(user => user.companyRoleName));
        this.userRole = Array.from(uniqueRoles);
        this.userService.getAllUsers().subscribe({
          next: (response) => {
            this.getUserProfilePhotos(this.users);
            this.allUsers = response.filter(user => user.companyRoleName !== 'Administrator');
            var userNames = this.users_backup.map(user => user.username);
            this.allUsers = this.allUsers.filter(user => !userNames.includes(user.username) && user.isActive == true);
            this.getUserProfilePhotos(this.allUsers);
          },
          error: (error) => {
            console.log(error); 
          }
        });
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

  search() {
    let searchTerm = this.searchTerm.toLowerCase().trim();
    let filteredUsers = [...this.users_backup];
  
    if (this.selectedRole && (this.selectedRole as any)) {
      filteredUsers = filteredUsers.filter(user => user.companyRoleName === (this.selectedRole as any));
    }
  
    if (searchTerm) {
      filteredUsers = filteredUsers.filter(user => user.username.toLowerCase().includes(searchTerm)
      || user.firstName.toLowerCase().includes(searchTerm)
      || user.lastName.toLowerCase().includes(searchTerm)
      || user.companyRoleName.toLowerCase().includes(searchTerm)
      || user.email.toLowerCase().includes(searchTerm)
      );
    }
    
    this.users = filteredUsers;
  }
  
  deleteUserFromProject(event: Event, username: string) {

    this.translateService.get([
      'project-people-page.user-removed',
      'project-people-page.user-not-removed',
      'project-people-page.do-you-want-to-remove-user',
      'project-people-page.delete-confirmation'
    ]).subscribe((res: any) => {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: res['project-people-page.do-you-want-to-remove-user'],
        header: res['project-people-page.delete-confirmation'],
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
                this.allUsers.push(this.users[indexToRemove]);
                this.users.splice(indexToRemove, 1);
              }
      
              const indexToRemoveBackup = this.users_backup.findIndex(user => user.username === username);
              if(indexToRemoveBackup !== -1) {
                this.users_backup.splice(indexToRemoveBackup, 1);
              }
              // this.userRole = this.users_backup.map(user => user.companyRoleName);
              const uniqueRoles = new Set(this.users.map(user => user.companyRoleName));
              this.userRole = Array.from(uniqueRoles);
              this.msgPopupService.showSuccess(res['project-people-page.user-removed']);
            },
            error: error => {
              this.msgPopupService.showError(res['project-people-page.user-not-removed']);
              console.log(error);
            }
          });
        },
        reject: () => {
            // this.msgPopupService.showError('You have rejected');
        }
      });
    });
  }

  addUser() {
    this.userOnProjectService.addUserOnProject(this.projectName, (this.userForAdd as any).username, this.color).subscribe({
      next: (response) => {
        this.translateService.get('project-people-page.user-added').subscribe((res: any) => {
          this.msgPopupService.showSuccess(res);
        });
        this.allUsers = this.allUsers.filter(user => user.username !== (this.userForAdd as any).username);
        this.userForAdd = "";

        this.userOnProjectService.getAllUsersOnProject(this.projectName).subscribe({
          next: (response) => {
            this.users = response;
            this.users_backup = response;
            // this.userRole = this.users_backup.map(user => user.companyRoleName);
            const uniqueRoles = new Set(this.users.map(user => user.companyRoleName));
            this.userRole = Array.from(uniqueRoles);
          },
          error: (error) => {
            console.log(error);
          }
        });
      },
      error: (error) => {
        this.translateService.get('project-people-page.user-not-added-duplicate-names').subscribe((res: any) => {
          this.msgPopupService.showError(res);
        });
      }
    })
  }
  updateOptions(dropdown :any){
    dropdown.options = this.allUsers;
  }

  onSelectedChange(){
    this.selectedColumns.forEach(item => {
      if(!this.showColumns.includes(item)){
        this.showColumns.push(item);
      }
    });
    this.showColumns.forEach((item,index) => {
      if(!this.selectedColumns.includes(item) && item!=='Username' && item !==''){
        this.showColumns.splice(index,1);
      }
    })
  }

  showProfile(username : string){
    this.translateService.get('user-profile.title').subscribe((res: any) => {
      this.ref = this.dialogService.open(UserProfileComponent, {
        header : res,
        height : '60%',
        width: window.innerWidth < 700 ? '80%' : '40%',
        contentStyle: { 
          overflow: 'auto',
        },
        baseZIndex: 10000,
        closable: true,
        modal: true,
        dismissableMask: true,
        closeOnEscape: true,
        maximizable: true,
        breakpoints: {
          '1100px':'75vw',
          '400px' : '90vw'
        },
        data: {
          username: username,
          usersPhotos: this.usersPhotos,
          users: this.users
        }
      });
    });
  }
}