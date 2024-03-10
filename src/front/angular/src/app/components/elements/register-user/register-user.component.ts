import { Component } from '@angular/core';
import { AccountService } from '../../../_service/account.service';

interface User{
    FirstName : string,
    LastName: string,
    Username: string,
    Email: string,
    Password: string,
    CompanyRoleId: number,
    Address: string,
    ContactPhone: string,
    LinkedinProfile: string,
    Status: string
}

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css'
})
export class RegisterUserComponent {

  user : User ={
    FirstName : "",
    LastName: "",
    Username: "",
    Email: "",
    Password: "",
    CompanyRoleId: 0,
    Address: "",
    ContactPhone: "",
    LinkedinProfile: "",
    Status: ""
  }

  constructor(public accoutService: AccountService) { }

  register(){
    this.accoutService.register(this.user).subscribe()
  }

}
