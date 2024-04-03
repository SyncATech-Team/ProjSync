import { Component, OnInit } from '@angular/core';
import { UserGetter } from '../../../_models/user-getter';
import { UserService } from '../../../_service/user.service';
import { MessageService } from 'primeng/api';
import { FileUploadEvent } from 'primeng/fileupload';
import { MessagePopupService } from '../../../_service/message-popup.service';
import { UserProfilePicture } from '../../../_service/userProfilePhoto';
import { NavBarComponent } from '../../elements/nav-bar/nav-bar.component';

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

  username : string = '';
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

  profilePicturePath : string = ''; 

  constructor(private userService: UserService,
    private messageService: MessageService,
    private msgPopupService: MessagePopupService,
    private userProfilePhoto: UserProfilePicture,
    private navBarComponent: NavBarComponent) {}


  ngOnInit(): void {
    this.userService.getUser(this.getUsername()).subscribe({
      next: response => {
        this.user = response;
        this.username = this.user.username;
        this.editUser = response;
        this.navBarComponent.ngOnInit();
        this.getProfilePhoto();
        this.getPhoto();
      },
      error: error => {
        console.log(error.error);
      }
    });
  }

  // POZIV SERVISA ZA DOHVATANJE SLIKE KORISNIKA
  getPhoto(){
    this.userProfilePhoto.getUserImage(this.username).subscribe({
      next: response => {
        this.profilePicturePath = response['fileContents'];
        this.profilePicturePath = this.decodeBase64Image(response['fileContents']);
    },
      error: error => {
        console.log(error);
    }
    });
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
    return this.profilePicturePath;
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

  decodeBase64Image(base64String: string) {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
  }

  onFileSelected(event: any){
    //POKUPIM FAJL ZA SLANJE
    if(event.target.files && event.target.files.length > 0){
      const selectedFile = event.target.files[0];

      this.userProfilePhoto.uploadUserImage(this.username, selectedFile).subscribe({
        next: response => {
          this.msgPopupService.showSuccess("Successfully uploaded image");
          this.ngOnInit();
        },
        error: error => {
          this.msgPopupService.showError("Unable to upload image");
        }
      });
    }
  }

}
