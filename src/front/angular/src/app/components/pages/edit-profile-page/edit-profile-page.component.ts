import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserGetter } from '../../../_models/user-getter';
import { UserService } from '../../../_service/user.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUploadEvent } from 'primeng/fileupload';
import { MessagePopupService } from '../../../_service/message-popup.service';
import { UserProfilePicture } from '../../../_service/userProfilePicture.service';
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
  @ViewChild('fileInputRef') fileInputRef: ElementRef | undefined;

  imageLoading: boolean = false;
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
    private navBarComponent: NavBarComponent,
    private confirmationService: ConfirmationService) {}


  ngOnInit(): void {
    this.userService.getUser(this.getUsername()).subscribe({
      next: response => {
        this.user = response;
        this.username = this.user.username;
        this.editUser = response;
        console.log(this.user);
        if(this.user.profilePhoto != null) {
          this.userProfilePhoto.getUserImage(this.user.username).subscribe({
            next: response => {
              this.profilePicturePath = response['fileContents'];
              this.profilePicturePath = this.userProfilePhoto.decodeBase64Image(response['fileContents']);
              this.setUserPicture(this.profilePicturePath);
          },
            error: error => {
              console.log(error);
          }
          });
        }
        else {
          this.setUserPicture("SLIKA_JE_NULL");
        }
        this.navBarComponent.ngOnInit();
      },
      error: error => {
        console.log(error.error);
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

  onFileSelected(event: any){
    this.imageLoading = true;
    //POKUPIM FAJL ZA SLANJE
    if(event.target.files && event.target.files.length > 0){
      const selectedFile = event.target.files[0];
      const fileSize = selectedFile.size;

      if (fileSize > 5000000) { // 5MB u bajtovima
        this.msgPopupService.showError("File size exceeds 5MB limit");
        return;
      }

      this.userProfilePhoto.uploadUserImage(this.username, selectedFile).subscribe({
        next: response => {
          this.msgPopupService.showSuccess("Successfully uploaded image");
          this.ngOnInit();

          if(this.fileInputRef){
            this.fileInputRef.nativeElement.value = '';
          }
          this.imageLoading = false;
        },
        error: error => {
          this.msgPopupService.showError("Unable to upload image");
          this.imageLoading = false;
        }
      });
    }
  }

  getDefaultImage() {
    return this.userProfilePhoto.getFirstDefaultImagePath();
  }

  setUserPicture(src : string){
    let element = document.getElementById("profile-image2");
    let image = element as HTMLImageElement;

    if(src === "SLIKA_JE_NULL") {
      if(this.user){
        image.src = this.userProfilePhoto.getDefaultImageForUser(this.user.username);
      }
      else{
        image.src = this.userProfilePhoto.getFirstDefaultImagePath();
      }
    }
    else {
      image.src = src;
    }
  }

  removePhoto(){
    this.imageLoading = true;
    if(this.user){
      this.userProfilePhoto.removeUserImage(this.user.username).subscribe({
        next : respones =>{
          this.imageLoading = false;
          this.ngOnInit();
        },
        error: error => {
          this.imageLoading = false;
          console.log(error.error);
        }
      });
    }
  }

  openPopUp(event : any){
    if(this.user && this.user.profilePhoto != null){
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Do you want to remove your profile photo?',
        icon: 'pi pi-info-circle',
        acceptButtonStyleClass: 'p-button-danger p-button-sm rounded',
        accept: () => {
            this.removePhoto();
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Profile photo removed', life: 3000 });
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
      });
    }
  }
}
