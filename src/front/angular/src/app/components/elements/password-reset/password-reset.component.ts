import { Component } from '@angular/core';
import { ResetPassword } from '../../../_models/reset-password';
import { AccountService } from '../../../_service/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.css'
})
export class PasswordResetComponent {

  constructor(private accountService: AccountService, private router: Router) {

  }

  private passResetToken = "";
  private email = "";

  passwordReset: ResetPassword = {
    token: '',
    email: '',
    password: '',
    confirmPassword: ''
  }

  showPassword: boolean = false;
  showPasswordOld: boolean = false;
  showPasswordCnf: boolean = false;

  togglePasswordVisibility(){
    this.showPassword = !this.showPassword;
  }
  togglePasswordVisibilityOld(){
    this.showPasswordOld = !this.showPasswordOld;
  }
  togglePasswordVisibilityCnf(){
    this.showPasswordCnf = !this.showPasswordCnf;
  }

  reset() {
    this.getTokenAndEmail();
    this.passwordReset['token'] = this.passResetToken;
    this.passwordReset['email'] = this.email;

    this.accountService.resetPassword(this.passwordReset).subscribe({
      next: _ => {
        this.router.navigateByUrl('home')
      }
    });
  }

  getTokenAndEmail() {
    var storage = localStorage.getItem("pass-reset");
    if(!storage) return;

    var token = JSON.parse(storage);
    this.passResetToken = token['token'];
    this.email = token['email'];
  }

}
