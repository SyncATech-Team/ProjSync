import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../_service/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'container-login',
  templateUrl: './container-login.component.html',
  styleUrl: './container-login.component.css'
})
export class ContainerLoginComponent {
  user : any = {
    username:  "",
    password:  ""
  }

  showPassword: boolean = false;

  togglePasswordVisibility(){
    this.showPassword = !this.showPassword;
  }
}
