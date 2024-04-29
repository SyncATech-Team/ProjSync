import { Component } from '@angular/core';
import { AccountService } from './_service/account.service';
import { NotificationService } from './_service/notification.service';
import { PresenceService } from './_service/presence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular';

  constructor(
    public accountService: AccountService
  ) {}

}
