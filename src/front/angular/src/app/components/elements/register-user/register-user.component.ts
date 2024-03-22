import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { AccountService } from '../../../_service/account.service';
import { RegisterModel } from '../../../_models/register-user';
import { CompanyroleService } from '../../../_service/companyrole.service';
import { Observable } from 'rxjs';
import { CompanyRole } from '../../../_models/company-role';
import { MessagePopupService } from '../../../_service/message-popup.service';
import { NgForm } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { UserGetter } from '../../../_models/user-getter';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css',
})
export class RegisterUserComponent implements OnInit {
  roles$: Observable<CompanyRole[]> | undefined;
  @ViewChild('registerForm') formRecipe?: NgForm; 

  registrationModel: RegisterModel = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    companyRole: '',
    address: '',
    contactPhone: ''
  };

  constructor(public accoutService: AccountService, 
    public companyRoleService: CompanyroleService, public msgPopupService: MessagePopupService,
    private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.roles$ = this.companyRoleService.getAllCompanyRoleNames();
  }

  @Output() userCreated = new EventEmitter<UserGetter>();

  register() {

    this.accoutService.register(this.registrationModel).subscribe({
      next: (response) => {
        this.msgPopupService.showSuccess("Successfully registered new user!");
        this.userCreated.emit(response);
        this.onSuccessfulRegistration();
      },

      error: (error) => {
        // prikazi poruku greske
        this.msgPopupService.showError("Unable to register new user. Check input fields!");
      }
    });
  }
  
  onSuccessfulRegistration(){
    this.formRecipe?.reset();
    this.changeDetectorRef.detectChanges();
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

}
