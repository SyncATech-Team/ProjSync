import { Component, OnInit } from '@angular/core';
import { UserGetter } from '../../../_models/user-getter';
import { UserService } from '../../../_service/user.service';
import { MessageService } from 'primeng/api';
import { FileUploadEvent } from 'primeng/fileupload';
import { MessagePopupService } from '../../../_service/message-popup.service';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-edit-profile-page',
  templateUrl: './edit-profile-page.component.html',
  styleUrl: './edit-profile-page.component.css',
  providers: [MessageService]
})
export class EditProfilePageComponent implements OnInit {

  user?: UserGetter;
  editUser: UserGetter = {
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    companyRoleName: '',
    contactPhone: '',
    profilePhoto: '',
    address: '',
    status: '',
    isVerified: false,
    preferedLanguage: '',
    isActive: false
  };

  constructor(private userService: UserService, private messageService: MessageService,
    private msgPopupService: MessagePopupService) {}


  ngOnInit(): void {
    this.userService.getUser(this.getUsername()).subscribe({
      next: response => {
        this.user = response;
        this.editUser = response;
      },
      error: error => {
        console.log(error.error);
      }
    })
  }

  onBasicUploadAuto(event: FileUploadEvent) {
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Auto Mode' });
  }

  getUsername() {
    let x = localStorage.getItem("user");
    if(x == null) return "";

    return JSON.parse(x)['username'];
  }

  getProfilePhoto() {
    if(this.user == null) return "../../../../assets/images/DefaultAccountProfileImages/default_account_image_1.png";
    if(this.user.profilePhoto == null ) return "../../../../assets/images/DefaultAccountProfileImages/default_account_image_1.png";
    return "../../../../assets/images/UserProfileImages/" + this.user.profilePhoto;
  }

  getFirstName() {
    if(this.user == null) return "John";
    return this.user.firstName;
  }

  getLastName() {
    if(this.user == null) return "Doe";
    return this.user.lastName;
  }

  getAddress() {
    if(this.user == null) return "None";
    return this.user.address;
  }

  getPhone() {
    if(this.user == null) return "None";
    return this.user.contactPhone;
  }

  getStatus() {
    if(this.user == null) return "None";
    return this.user.status;
  }

  applyEditChanges() {
    this.editUser.isActive = this.user?.isActive;  // spreciti deaktivaciju naloga kada se edituje user
    this.userService.updateUserInfo(this.editUser.username, this.editUser).subscribe({
      next: response => {
        this.msgPopupService.showSuccess("Successfully edited user info");
        this.ngOnInit();
      },
      error: error => {
        this.msgPopupService.showError("Unable to edit user info");
      }
    });
  } 

}
