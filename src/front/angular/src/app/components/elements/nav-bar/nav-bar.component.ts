import { Component, Injectable, OnInit } from '@angular/core';
import { AccountService } from '../../../_service/account.service';
import { Router } from '@angular/router';
import { UserService } from '../../../_service/user.service';
import { UserGetter } from '../../../_models/user-getter';
import { UserProfilePicture } from '../../../_service/userProfilePhoto';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
@Injectable({
  providedIn: 'root'
})
export class NavBarComponent implements OnInit {

  user?: UserGetter;
  notify_collapsed : boolean = false;

  profilePicturePath: string = '';

  constructor(public accoutService: AccountService,
    private router: Router,
    private userService: UserService,
    private userProfilePhoto: UserProfilePicture) { }
  
  ngOnInit(): void {
    this.userService.getUser(this.getUsername()).subscribe({
      next: response => {
        this.user = response;
        this.userProfilePhoto.getUserImage(this.user.username).subscribe({
          next: response => {
            this.profilePicturePath = response['fileContents'];
            this.profilePicturePath = this.decodeBase64Image(response['fileContents']);
            this.getProfilePhoto();
        },
          error: error => {
            console.log(error);
        }
        });
      },
      error: error => {
        console.log(error.error);
      }
    })
  }
  
  logout() {
    this.accoutService.logout();
    this.router.navigateByUrl('/');
  }

  toggleNotifyCollapsed(){
    this.notify_collapsed = !this.notify_collapsed;
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

  getFullName() {
    if(this.user == null) return "John Doe";
    return this.user.firstName + " " + this.user.lastName;
  }

  getEmail() {
    if(this.user == null) return "syncatech@hotmail.com";
    return this.user.email;
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

  updateProfilePicture(src : string){
    let listOfElements = document.getElementsByClassName("user-profile");

    for(let i = 0; i < listOfElements.length; i++){
      let image = listOfElements[i] as HTMLImageElement;
      image.src = src;
    }
  }
}
