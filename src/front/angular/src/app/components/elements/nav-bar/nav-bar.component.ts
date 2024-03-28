import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../_service/account.service';
import { Router } from '@angular/router';
import { UserService } from '../../../_service/user.service';
import { UserGetter } from '../../../_models/user-getter';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit {

  user?: UserGetter;
  notify_collapsed : boolean = false;

  constructor(public accoutService: AccountService, private router: Router, private userService: UserService) { }
  
  ngOnInit(): void {
    this.userService.getUser(this.getUsername()).subscribe({
      next: response => {
        this.user = response;
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
    return "../../../../assets/images/UserProfileImages/" + this.user.profilePhoto;
  }

  getFullName() {
    if(this.user == null) return "John Doe";
    return this.user.firstName + " " + this.user.lastName;
  }

  getEmail() {
    if(this.user == null) return "syncatech@hotmail.com";
    return this.user.email;
  }

}
