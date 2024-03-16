import { Component } from '@angular/core';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.css'
})
export class PasswordResetComponent {

  user : any={
    password : ""
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

  reset(){

  }

}
