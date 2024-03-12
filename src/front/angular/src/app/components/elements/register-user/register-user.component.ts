import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../_service/account.service';
import { RegisterModel } from '../../../_models/register-user';
import { CompanyroleService } from '../../../_service/companyrole.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css'
})
export class RegisterUserComponent implements OnInit {
  roles: string[] = [];

  registrationModel: RegisterModel = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    companyRole: '',
    address: '',
    contactPhone: '',
    linkedinProfile: '',
    status: ''
  };

  constructor(public accoutService: AccountService, public companyRoleService: CompanyroleService) { }

  ngOnInit(): void {
    this.getAllCompanyRoles();
  }

  register() {

    console.log(document.getElementById('invalid_register_div'));

    this.accoutService.register(this.registrationModel).subscribe({
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

    // dohvati sva imena za company role
    getAllCompanyRoles() {
      this.companyRoleService.getAllCompanyRoles().subscribe({
        next: response => this.roles = response
      })
    }

}
