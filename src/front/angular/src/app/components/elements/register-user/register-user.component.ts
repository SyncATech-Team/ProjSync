import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AccountService } from '../../../_service/account.service';
import { RegisterModel } from '../../../_models/register-user';
import { CompanyroleService } from '../../../_service/companyrole.service';
import { Observable } from 'rxjs';
import { CompanyRole } from '../../../_models/company-role';
import { UserPageComponent } from '../../pages/admin-page/user-page/user-page.component';

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

  constructor(public accoutService: AccountService, 
    public companyRoleService: CompanyroleService, private userPage: UserPageComponent) { }

  ngOnInit(): void {
    this.roles$ = this.companyRoleService.getAllCompanyRoleNames();
  }

  @Output() userCreated = new EventEmitter<RegisterModel>();

  register() {

    this.accoutService.register(this.registrationModel).subscribe({
      next: () => {
        this.userPage.showSuccess("Successfully registered new user!");
        this.userCreated.emit(this.registrationModel);
      },

      error: (error) => {
        // prikazi poruku greske
        this.userPage.showError("Unable to register new user. Check input fields!");
      }
    });
  }
  
  suggestUsername() {
    let x = document.getElementById("input-email") as HTMLInputElement;
    let y = document.getElementById("input-username") as HTMLInputElement;

    if(x != null) {
      let v = x.value.split("@")[0];
      y.value = v;
      this.registrationModel.username = v;
    }
  }

  // close_alerts() {
  //   this.adminPage.close_all_alerts();
  // }

}
