import { Component } from '@angular/core';
import { EmailValidationService } from '../../../_service/email_validator.service';
import { Router } from '@angular/router';
import { AccountService } from '../../../_service/account.service';
import { MessageService } from "primeng/api";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  user : any = {
    email:  "",
    password:  ""
  }

  emailValid: boolean = false;

  constructor(
    public accountService: AccountService,
    private router: Router,
    private mailValidationService: EmailValidationService,
    private messageService: MessageService
  ) { }

  validateEmail(email: string): boolean {
    this.emailValid = this.mailValidationService.isValidEmailAddress(email);
    return this.emailValid;
  }

  forgot_pass() {
    if (!this.emailValid) {
      return;
    }
  }
}
