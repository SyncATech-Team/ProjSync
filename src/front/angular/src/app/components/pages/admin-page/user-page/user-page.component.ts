import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../../_service/account.service';
import { UserGetter } from '../../../../_models/user-getter';
import { RegisterModel } from '../../../../_models/register-user';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent implements OnInit {
  
  users: UserGetter[] = [];

  constructor(private http: HttpClient, private accountService: AccountService){ }

  ngOnInit(): void {
      this.accountService.getAllUsers().subscribe({
        next: response => {
          this.users = response;
          console.log(this.users);
        },
        error: error => {
          console.log("ERROR: " + error);
        }
      });
  }

  onUserCreated(user: RegisterModel) {
    this.users.push({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      companyRoleId: user.companyRole,
      phone: user.contactPhone
    });  // Add the new user to the users array
  }

}
