import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserGetter } from '../../../_models/user-getter';
import { UserService } from '../../../_service/user.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUploadEvent } from 'primeng/fileupload';
import { MessagePopupService } from '../../../_service/message-popup.service';
import { UserProfilePicture } from '../../../_service/userProfilePicture.service';
import { NavBarComponent } from '../../elements/nav-bar/nav-bar.component';
import { AuthUserChangePassword } from '../../../_models/change-passowrd-auth-user';
import { AccountService } from '../../../_service/account.service';

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

  changePasswordFields: AuthUserChangePassword = {
    username: "",
    currentPassword: "",
    newPassword: ""
  }

  newPasswordAgain: string = "";

  pattern = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

  constructor(private userService: UserService,
    private messageService: MessageService,
    private msgPopupService: MessagePopupService,
    private userProfilePhoto: UserProfilePicture,
    private navBarComponent: NavBarComponent,
    private confirmationService: ConfirmationService,
    private accountService: AccountService) {}


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
        this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Successfully edited user info', life: 3000 });
        this.ngOnInit();
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Unable to edit user info', life: 3000 });
      }
    });
  } 

  changePassword() {
    this.changePasswordFields.username = this.user!.username;
    this.accountService.changePasswordForAuthorizedUser(this.changePasswordFields).subscribe({
      next: response => {
        this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: "Password changed", life: 3000 });
        this.ngOnInit();
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: "Password not changed", life: 3000 });
      }
    })
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
          this.messageService.add({ severity: 'success', summary: 'Successfully', detail: 'Profile photo added', life: 3000 });
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Image not added', life: 3000 });
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
            this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Profile photo removed', life: 3000 });
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
      });
    }
  }

  theSamePasswords() {
    let check = this.changePasswordFields.newPassword === this.newPasswordAgain;
    if(check == false) {
      document.getElementById("newpswdverify")?.classList.add("problem");
      document.getElementById("newpswd")?.classList.add("problem");
    }
    else {
      document.getElementById("newpswdverify")?.classList.remove("problem");
      document.getElementById("newpswd")?.classList.remove("problem");
    }

    check = check && this.changePasswordFields.newPassword != "" && this.newPasswordAgain != "";
    if(check == false || this.changePasswordFields.currentPassword == "") return false;

    if(!this.pattern.test(this.changePasswordFields.newPassword)) {
      document.getElementById("error-display-span")!.innerHTML = `
      Invalid password pattern  
      <i 
          class="pi pi-question-circle"
          style="color: black"
          title="Password needs to be at least 6 characters long and have one upper letter and one digit"></i>
      `;
    }
    else {
      document.getElementById("error-display-span")!.innerHTML = "";
    }

    return check && this.changePasswordFields.currentPassword != "";
  }

}
