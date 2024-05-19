import { Component, Injectable, OnInit } from '@angular/core';
import { AccountService } from '../../../_service/account.service';
import { Router } from '@angular/router';
import { UserService } from '../../../_service/user.service';
import { UserGetter } from '../../../_models/user-getter';
import { UserProfilePicture } from '../../../_service/userProfilePicture.service';
import { ThemeService } from '../../../../themes/theme.service';

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

  isDarkTheme?: boolean;

  constructor(
      private accountService: AccountService,
      private router: Router,
      private userService: UserService,
      private userProfilePictureService: UserProfilePicture,
      private themeService: ThemeService
    ) {
  }

  ngOnInit(): void {
    this.userService.getUser(this.getUsername()).subscribe({
      next: response => {
        this.user = response;
        if(this.user.profilePhoto != null) {
          this.userProfilePictureService.getUserImage(this.user.username).subscribe({
            next: response => {
              this.profilePicturePath = response['fileContents'];
              this.profilePicturePath = this.userProfilePictureService.decodeBase64Image(response['fileContents']);
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
        this.themeService.switchTheme(this.user!.preferedTheme!);
        this.isDarkTheme =  this.themeService.getTheme();
      },
      error: error => {
        console.log(error.error);
      }
    });
  }
  
  logout() {
    this.accountService.logout();
    this.themeService.switchTheme('lara-light-blue');
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
        image.src = this.userProfilePictureService.getDefaultImageForUser(this.user.username);
      else
        image.src = this.userProfilePictureService.getFirstDefaultImagePath();
    }
    else {
      image.src = src;
    }
  }

  getDefaultImage() {
    return this.userProfilePictureService.getFirstDefaultImagePath();
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

  changeTheme(){
    if(this.isDarkTheme !== undefined)
      this.themeService.updateTheme(this.user!.username,this.isDarkTheme);
  }

}
