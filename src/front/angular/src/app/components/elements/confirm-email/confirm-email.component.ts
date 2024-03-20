import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../../../_service/account.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.css'
})
export class ConfirmEmailComponent implements OnInit {
  public hideResetPassword: boolean = true;

  constructor(private route: ActivatedRoute, private accountService: AccountService) {
    
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const userId = params.get('userId');
      const token = params.get('token');
      this.accountService.confirmEmail(userId, token)?.subscribe({
        next: () => {
          console.log('proslo');
        }
      })
    });
  }
}
