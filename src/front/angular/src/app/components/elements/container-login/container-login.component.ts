import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../_service/account.service';
import { Router } from '@angular/router';
import { EmailValidationService } from '../../../_service/email_validator.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'container-login',
  templateUrl: './container-login.component.html',
  styleUrl: './container-login.component.css'
})
export class ContainerLoginComponent implements OnInit {
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
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    let user_email_from_cookie = this.getCookieIfExists();
    if(user_email_from_cookie !== "") {
      this.user.email = user_email_from_cookie;
      this.validateEmail(this.user.email);

      // set remember me to be checked
      let checkbox_element = document.getElementById("input-checkbox-rememberme") as HTMLInputElement;
      checkbox_element.checked = true;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login() {
    if (!this.emailValid) {
      return;
    }

    let checkbox_element = document.getElementById("input-checkbox-rememberme") as HTMLInputElement;

    // dobili smo Observable, moramo da uradimo subscribe da bismo koristili
    this.accountService.login(this.user).subscribe({
      next: () => {
        if(checkbox_element.checked == true) {
          this.setCookieFor7Days(this.user.email);
        }
        else {
          this.deleteEmailCookie();
        }
        if (this.hasAdminRole()) this.router.navigateByUrl('/admin');
        else this.router.navigateByUrl('/home');
      },

      // TODO: Prikazati gresku kada npr korisnik unese pogresnu lozinku ili username
      error: error => {
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


  // Function to set a cookie that expires in 7 days
  setCookieFor7Days(mail: string): void {
    this.cookieService.set('remember_email_cookie', mail, 7);
  }

  getCookieIfExists() {
    return this.cookieService.get("remember_email_cookie");
  }

  deleteEmailCookie() {
    this.cookieService.delete("remember_email_cookie");
  }

}
