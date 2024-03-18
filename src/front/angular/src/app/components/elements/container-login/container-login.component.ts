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

  constructor(public accountService: AccountService, private router: Router) { }

  showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  login() {
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
    })
  }

  hasAdminRole() {
    const userString = localStorage.getItem('user');
    if (!userString) return false;

    const user = JSON.parse(userString);
    if (user.roles.includes('Admin')) return true;

    return false;
  }

}
