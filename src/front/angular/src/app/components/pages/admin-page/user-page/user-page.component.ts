import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserGetter } from '../../../../_models/user-getter';
import { RegisterModel } from '../../../../_models/register-user';
import { UserService } from '../../../../_service/user.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent implements OnInit {
  
  users: UserGetter[] = [];

  constructor(private http: HttpClient, private userService: UserService){ }

  ngOnInit(): void {
      this.userService.getAllUsers().subscribe({
        next: response => {
          this.users = response;
        },
        error: error => {
          console.log("ERROR: " + error.error);
        }
      });
  }

  onUserCreated(user: RegisterModel) {
    this.users.push({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      companyRoleName: user.companyRole,
      contactPhone: user.contactPhone
    });  // Add the new user to the users array
  }

  getRandomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  getDefaultImagePath(): string {
    let x: number = this.getRandomInteger(1, 10);
    let path: string = "../../../../../assets/images/DefaultAccountProfileImages/default_account_image_" + x + ".png";
    
    console.log(path);

    return path;
  }

}
