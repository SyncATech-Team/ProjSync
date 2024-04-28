import { Component, OnInit } from '@angular/core';
import { PresenceService } from './_service/presence.service';
import { AccountService } from './_service/account.service';
import { NotificationService } from './_service/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  
  title = 'angular';

  constructor(
    private presenceService: PresenceService,
    private notificationService: NotificationService,
    private accounService: AccountService
  ) {
      let user = accounService.getCurrentUser();
      if(user != null) {
        this.presenceService.createHubConnection(user);
        this.notificationService.createHubConnection(user);
      }
  }

  ngOnInit(): void {
    let user = this.accounService.getCurrentUser();

    this.presenceService.hubConnection?.onclose(() => {
      console.log("Reconnecting to presence hub...");
        if(user) this.presenceService.createHubConnection(user);
    })

    this.notificationService.hubConnection?.onclose(() => {
      console.log("Reconnecting to notification hub...");
      if(user) {
        this.notificationService.createHubConnection(user);
      }
    })

  }

}
