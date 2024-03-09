import { Component } from '@angular/core';
import { AccountService } from '../../../_service/account.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css'
})
export class RegisterUserComponent {

  user : any ={
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
