import { Component } from '@angular/core';
import { EmailValidationService } from '../../../_service/email_validator.service';
import { Router } from '@angular/router';
import { AccountService } from '../../../_service/account.service';
import { MessageService } from "primeng/api";
import { ForgotPasswordModel } from '../../../_models/forgot-password';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  user: ForgotPasswordModel = {
    email: ''
  };

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

    this.accountService.forgotPassword(this.user).subscribe({
      next: () => {
        this.router.navigateByUrl("account/password-reset");
      },

      error: _ => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: "Please check Your email" });
      }
    });
  }
}
