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
import { TranslateService } from '@ngx-translate/core';
import { LocalService } from '../../../_service/local.service';

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
    private accountService: AccountService,
    private translateService: TranslateService,
    private localService: LocalService
  ) {}


  ngOnInit(): void {
    this.userService.getUser(this.getUsername()).subscribe({
      next: response => {
        this.user = response;
        this.username = this.user.username;
        this.editUser = response;
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
    this.translateService.get([
      'general.success',
      'edit-profile-page.file-uploaded-with-auto-mode'
    ]).subscribe(translations => {
      this.messageService.add({ severity: 'info', summary: translations['general.success'], detail: translations['edit-profile-page.file-uploaded-with-auto-mode'] });
    });
  }

  getUsername() {
    let x = this.localService.getData('user');
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
    if(/^(\+\d{1,3}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(this.editUser.contactPhone) || this.editUser.contactPhone == '' || this.editUser.contactPhone == null){//testira format broja telefona
      this.userService.updateUserInfo(this.editUser.username, this.editUser).subscribe({
        next: response => {
          this.translateService.get([
            'general.success',
            'edit-profile-page.user-info-edited'
          ]).subscribe(translations => {
            this.messageService.add({ severity: 'success', summary: translations['general.success'], detail: translations['edit-profile-page.user-info-edited'], life: 3000 });
          });
          this.ngOnInit();
        },
        error: error => {
          this.translateService.get([
            'general.error',
            'edit-profile-page.user-info-not-edited'
          ]).subscribe(translations => {
            this.messageService.add({ severity: 'error', summary: translations['general.error'], detail: translations['edit-profile-page.user-info-not-edited'], life: 3000 });
          });
        }
      });
    }
    else{
      this.translateService.get([
        'general.error',
        'edit-profile-page.invalid-phone-format'
      ]).subscribe(translations => {
        this.messageService.add({ severity: 'error', summary: translations['general.error'], detail: translations['edit-profile-page.invalid-phone-format'], life: 3000 });
      });
    }
  } 

  changePassword() {
    this.changePasswordFields.username = this.user!.username;
    this.translateService.get([
      'edit-profile-page.password-changed',
      'edit-profile-page.password-not-changed',
      'general.confirmed',
      'general.error'
    ]).subscribe(translations => {
      this.accountService.changePasswordForAuthorizedUser(this.changePasswordFields).subscribe({
        next: response => {
          this.messageService.add({ severity: 'success', summary: translations['general.confirmed'], detail: translations['edit-profile-page.password-changed'], life: 3000 });
          this.ngOnInit();
        },
        error: error => {
          this.messageService.add({ severity: 'error', summary: translations['general.error'], detail: translations['edit-profile-page.password-not-changed'], life: 3000 });
        }
      })
    });
  }

  onFileSelected(event: any){
    this.imageLoading = true;
    //POKUPIM FAJL ZA SLANJE
    if(event.target.files && event.target.files.length > 0){
      const selectedFile = event.target.files[0];
      const fileSize = selectedFile.size;

      if (fileSize > 5000000) { // 5MB u bajtovima
        this.translateService.get([
          'edit-profile-page.file-size-exceeds-limit'
        ]).subscribe(translations => {
          this.msgPopupService.showError(translations['edit-profile-page.file-size-exceeds-limit']);
        });
        return;
      }

      this.userProfilePhoto.uploadUserImage(this.username, selectedFile).subscribe({
        next: response => {
          this.ngOnInit();

          if(this.fileInputRef){
            this.fileInputRef.nativeElement.value = '';
          }
          this.imageLoading = false;
          this.translateService.get([
            'general.success',
            'edit-profile-page.profile-photo-added'
          ]).subscribe(translations => {
            this.messageService.add({ severity: 'success', summary: translations['general.success'], detail: translations['edit-profile-page.profile-photo-added'], life: 3000 });
          });
        },
        error: error => {
          this.translateService.get([
            'general.error',
            'edit-profile-page.profile-photo-not-added'
          ]).subscribe(translations => {
            this.messageService.add({ severity: 'error', summary: translations['general.error'], detail: translations['edit-profile-page.profile-photo-not-added'], life: 3000 });
          });
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
      this.translateService.get([
        'edit-profile-page.remove-photo-confirm',
        'general.yes',
        'general.no',
        'general.confirmed',
        'general.rejected',
        'general.you-have-confirmed',
        'general.you-have-rejected',
        'edit-profile-page.photo-removed'
      ]).subscribe(translations => {
        this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: translations['edit-profile-page.remove-photo-confirm'],
          "acceptLabel": translations['general.yes'],
          "rejectLabel": translations['general.no'],
          icon: 'pi pi-info-circle',
          acceptButtonStyleClass: 'p-button-danger p-button-sm rounded',
          accept: () => {
              this.removePhoto();
              this.messageService.add({ severity: 'success', summary: translations['general.confirmed'], detail: translations['edit-profile-page.photo-removed'], life: 3000 });
          },
          reject: () => {
              this.messageService.add({ severity: 'error', summary: translations['general.rejected'],  detail: translations['general.you-have-rejected'], life: 3000 });
          }
        });
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
      this.translateService.get([
        'edit-profile-page.invalid-password-pattern',
        'edit-profile-page.pattern-info'
      ]).subscribe(translations => {
        document.getElementById("error-display-span")!.innerHTML = `${translations['edit-profile-page.invalid-password-pattern']}  
        <i 
            class="pi pi-question-circle"
            style="color: black"
            title="${translations['edit-profile-page.pattern-info']}"></i>`;
      });
    }
    else {
      document.getElementById("error-display-span")!.innerHTML = "";
    }

    return check && this.changePasswordFields.currentPassword != "";
  }

}
