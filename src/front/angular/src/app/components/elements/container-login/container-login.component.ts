import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../_service/account.service';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { User } from '../../../_models/user';

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

  constructor(public accountService: AccountService, private router: Router) { }

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
    const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    this.emailValid = regex.test(email);
    return this.emailValid;
  }


}
