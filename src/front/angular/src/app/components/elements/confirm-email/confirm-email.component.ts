import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AccountService } from '../../../_service/account.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.css'
})
export class ConfirmEmailComponent implements OnInit {
  public hideResetPassword: boolean = true;

  constructor(private activatedRoute: ActivatedRoute, private accountService: AccountService,
    private router: Router) {
    
  }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe(params => {
      const email = params.get('email');
      const token = params.get('token');
      this.accountService.confirmEmail(email, token)?.subscribe({
        next: () => {
          this.router.navigateByUrl("/password_reset")
        }
      })
    });
  }
}
