import { Component } from '@angular/core';
import { AccountService } from '../../../_service/account.service';
import { AdminPageComponent } from '../../pages/admin-page/admin-page.component';

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

  constructor(public accoutService: AccountService, private adminPage: AdminPageComponent) { }  // Potencijani improve 

  register(){

    console.log(document.getElementById('invalid_register_div'));

    this.accoutService.register(this.user).subscribe({
      next: () => {
        let y = document.getElementById("valid_register_div");
        if(y != null) y.hidden = false;

        let x = document.getElementById("invalid_register_div");
        if(x != null) x.hidden = true;
      },

      error: (error) => {
        // prikazi poruku greske
        let x = document.getElementById("invalid_register_div");
        if(x != null) x.hidden = false;

        let y = document.getElementById("valid_register_div");
        if(y != null) y.hidden = true;
      }
    });
  }

  close_alerts() {
    this.adminPage.close_all_alerts();
  }

}