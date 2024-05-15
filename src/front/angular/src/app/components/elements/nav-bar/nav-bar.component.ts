import { Component, Injectable, OnInit } from '@angular/core';
import { AccountService } from '../../../_service/account.service';
import { Router } from '@angular/router';
import { UserService } from '../../../_service/user.service';
import { UserGetter } from '../../../_models/user-getter';
import { UserProfilePicture } from '../../../_service/userProfilePicture.service';
import { PhotoForUser } from '../../../_models/photo-for-user';

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

  selectedUser?: UserGetter = undefined;
  usersForChat: UserGetter[] = [];
  usersForChatPhotos: PhotoForUser[] = [];

  constructor(
      private accountService: AccountService,
      private router: Router,
      private userService: UserService,
      private userPictureService: UserProfilePicture
    ) {
  }

  ngOnInit(): void {

    this.fetchUsersForChat();

    this.userService.getUser(this.getUsername()).subscribe({
      next: response => {
        this.user = response;
        if(this.user.profilePhoto != null) {
          this.userPictureService.getUserImage(this.user.username).subscribe({
            next: response => {
              this.profilePicturePath = response['fileContents'];
              this.profilePicturePath = this.userPictureService.decodeBase64Image(response['fileContents']);
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
      },
      error: error => {
        console.log(error.error);
      }
    })
  }

  // Create method to fetch users
  fetchUsersForChat() {
    this.userService.getAllUsers().subscribe(users => {
      this.usersForChat = users.filter(user => user.companyRoleName !== 'Administrator');
      this.getUserProfilePhotos(this.usersForChat);
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
            this.usersForChatPhotos.push(ph);
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
        this.usersForChatPhotos.push(ph);
      }
    }
  }

  getUserImagePath(username: string,users: UserGetter[]) {
    let index = users.findIndex(u => u.username === username);
    if(index == -1) return this.userPictureService.getFirstDefaultImagePath();

    if(users[index].profilePhoto == null)
      return this.userPictureService.getDefaultImageForUser(users[index].username);

    let ind = this.usersForChatPhotos.findIndex(u => u.username == username);
    if(ind == -1) return this.userPictureService.getFirstDefaultImagePath();
    return this.usersForChatPhotos[ind].photoSource;
  }

  onUserChange(event: any) {
    console.log(event);
  }
  
  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

  toggleNotifyCollapsed(){
    this.notify_collapsed = !this.notify_collapsed;
  }

  getUsername() {
    if(typeof localStorage === "undefined") {
      return null;
    }
    let x = localStorage.getItem("user");
    if(x == null) return "";

    return JSON.parse(x)['username'];
  }

  getFullName() {
    if(this.user == null) return "John Doe";
    return this.user.firstName + " " + this.user.lastName;
  }

  getEmail() {
    if(this.user == null) return "syncatech@hotmail.com";
    return this.user.email;
  }

  setUserPicture(src : string){
    let element = document.getElementById("profile-image");
    let image = element as HTMLImageElement;

    if(src === "SLIKA_JE_NULL") {
      if(this.user)
        image.src = this.userPictureService.getDefaultImageForUser(this.user.username);
      else
        image.src = this.userPictureService.getFirstDefaultImagePath();
    }
    else {
      image.src = src;
    }
  }

  getDefaultImage() {
    return this.userPictureService.getFirstDefaultImagePath();
  }

  setSmallerUserPicture() {
    let element = document.getElementById("small_user_image");
    if(element == null) return;
    
    let image = element as HTMLImageElement;

    let vecaSlika = document.getElementById("profile-image") as HTMLImageElement;
    image.src = vecaSlika.src;
     
  }

  navigateToDesiredTab(showUserTasks: string): void {
    this.router.navigate(['/home'], {
      queryParams: { showUserTasks }
    });
  }

}
