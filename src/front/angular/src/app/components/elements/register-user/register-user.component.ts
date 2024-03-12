import { Component } from '@angular/core';
import { AccountService } from '../../../_service/account.service';

interface User{
    FirstName : string,
    LastName: string,
    Username: string,
    Email: string,
    Password: string,
    CompanyRoleId: number | null,
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
    CompanyRoleId: null,
    Address: "",
    ContactPhone: "",
    LinkedinProfile: "",
    Status: ""
  }

  constructor(public accoutService: AccountService) { }

  register(){

    console.log(document.getElementById('invalid_register_div'));

    this.accoutService.register(this.user).subscribe({
      next: () => {
        let x = document.getElementById("invalid_register_div");
        if(x != null) x.hidden = true;
      },

      error: (error) => {
        // prikazi poruku greske
        let x = document.getElementById("invalid_register_div");
        if(x != null) x.hidden = false;
      }
    });
  }

}
