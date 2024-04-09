import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../_service/account.service';
// import { ResetPasswordAfterEmailConformation } from '../../../_models/reset-password-response';
// import { response } from 'express';
// import { map, take } from 'rxjs';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.css'
})
export class ConfirmEmailComponent {
  public hideResetPassword: boolean = true;

  constructor(private activatedRoute: ActivatedRoute, private accountService: AccountService,
    private router: Router) {
      this.verifyEmail();
  }


  verifyEmail() {
    this.activatedRoute.queryParamMap.subscribe(params => {
      const email = params.get('email');
      const token = params.get('token');
      this.accountService.confirmEmail(email, token).subscribe({
        next: _ => {
          this.router.navigateByUrl("account/password-reset");
        }
      })
    });
  }
}
