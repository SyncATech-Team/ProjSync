import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../_service/account.service';
import { Router } from '@angular/router';
import { EmailValidationService } from '../../../_service/email_validator.service';
import { MessagePopupService } from '../../../_service/message-popup.service';

@Component({
  selector: 'container-login',
  templateUrl: './container-login.component.html',
  styleUrl: './container-login.component.css'
})
export class ContainerLoginComponent {
  user : any = {
    email:  "",
    password:  ""
  }

  showPassword: boolean = false;
  emailValid: boolean = false;

  constructor(
    public accountService: AccountService, 
    private router: Router,
    private mailValidationService: EmailValidationService,
    private msgPopUpService: MessagePopupService
  ) { }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (!this.emailValid) {
      return;
    }

    // dobili smo Observable, moramo da uradimo subscribe da bismo koristili
    this.accountService.login(this.user).subscribe({
      next: () => {
        if (this.hasAdminRole()) this.router.navigateByUrl('/admin');
        else this.router.navigateByUrl('/home');
      },

      // TODO: Prikazati gresku kada npr korisnik unese pogresnu lozinku ili username
      error: error => {
        this.msgPopUpService.showError("Invalid credentials");
        let x = document.getElementById("invalid_login_div");
        if(x != null) x.hidden = false;
      }
    });
  }

  hasAdminRole() {
    const userString = localStorage.getItem('user');
    if (!userString) return false;

    const user = JSON.parse(userString);
    if (user.roles.includes('Admin')) return true;

    return false;
  }

  validateEmail(email: string): boolean {
    this.emailValid = this.mailValidationService.isValidEmailAddress(email);
    return this.emailValid;
  }


}
