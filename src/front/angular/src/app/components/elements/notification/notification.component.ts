import { Component, Injectable, OnInit } from '@angular/core';
import { NotificationControllerService } from '../../../_service/notification-controller.service';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit {
  
  private static unreadNotifications: number = 0;
  
  constructor(
    private notificationControllerService: NotificationControllerService
  ) { }

  ngOnInit(): void {
    this.notificationControllerService.getNotificationCount().subscribe({
      next: response => {
        NotificationComponent.unreadNotifications = response;
        NotificationComponent.ChangeNumberOfUnreadNotificationsUI(NotificationComponent.unreadNotifications);
      },
      error: error => {
        console.log("ERROR: " + error.error);
        NotificationComponent.unreadNotifications = 0;
        NotificationComponent.ChangeNumberOfUnreadNotificationsUI(NotificationComponent.unreadNotifications);
      }
    })
  }

  public static increaseNumberOfUnreadMessages(): void {
    this.unreadNotifications = this.unreadNotifications + 1;
    this.ChangeNumberOfUnreadNotificationsUI(this.unreadNotifications);
  }

  private static ChangeNumberOfUnreadNotificationsUI(value: number) {
    let element = document.getElementById("number-of-unread-notifications-span");
    if(element)
      element.innerHTML = "" + value;
  }

}
