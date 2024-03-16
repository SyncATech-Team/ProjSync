import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AccountService } from '../../../_service/account.service';
import { RegisterModel } from '../../../_models/register-user';
import { CompanyroleService } from '../../../_service/companyrole.service';
import { AdminPageComponent } from '../../pages/admin-page/admin-page.component';
import { Observable } from 'rxjs';
import { CompanyRole } from '../../../_models/company-role';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css'
})
export class RegisterUserComponent implements OnInit {
  roles$: Observable<CompanyRole[]> | undefined;

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

  constructor(public accoutService: AccountService, public companyRoleService: CompanyroleService, private adminPage: AdminPageComponent) { }

  ngOnInit(): void {
    this.roles$ = this.companyRoleService.getAllCompanyRoleNames();
  }

  @Output() userCreated = new EventEmitter<RegisterModel>();

  register() {

    console.log(document.getElementById('invalid_register_div'));

    this.accoutService.register(this.registrationModel).subscribe({
      next: () => {
        let y = document.getElementById("valid_register_div");
        if (y != null) y.hidden = false;

        let x = document.getElementById("invalid_register_div");
        if (x != null) x.hidden = true;

        this.userCreated.emit(this.registrationModel);
      },

      error: (error) => {
        // prikazi poruku greske
        let x = document.getElementById("invalid_register_div");
        if (x != null) x.hidden = false;

        let y = document.getElementById("valid_register_div");
        if (y != null) y.hidden = true;
      }
    });
  }
  
  // close_alerts() {
  //   this.adminPage.close_all_alerts();
  // }

}
