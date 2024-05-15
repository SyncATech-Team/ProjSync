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

  public static decreaseNumberOfUnreadMessages(): void {
    this.unreadNotifications = this.unreadNotifications - 1;
    this.ChangeNumberOfUnreadNotificationsUI(this.unreadNotifications);
  }

  public static resetoToZero(): void {
    this.unreadNotifications = 0;
    this.ChangeNumberOfUnreadNotificationsUI(this.unreadNotifications);
  }

  public static getNumberOfUnreadNotifications(): number {
    return this.unreadNotifications;
  }

  private static ChangeNumberOfUnreadNotificationsUI(value: number) {
    let element = document.getElementById("number-of-unread-notifications-span");
    let badgeDiv = document.getElementById("badge-div");
    let valueToInsert = (value <= 99) ? "" + value : "99+";

    if(badgeDiv?.classList.contains("badge-pulse")) badgeDiv?.classList.remove("badge-pulse");
    if(value > 0) { badgeDiv?.classList.add("badge-pulse"); }

    if(element) {

      element.innerHTML = "" + valueToInsert;

      if(badgeDiv!.classList.contains("badgecolor-blue")) badgeDiv!.classList.remove("badgecolor-blue");
      if(badgeDiv!.classList.contains("badgecolor-yellow")) badgeDiv!.classList.remove("badgecolor-yellow");
      if(badgeDiv!.classList.contains("badgecolor-red")) badgeDiv!.classList.remove("badgecolor-red");

      if(this.unreadNotifications < 5) {
        badgeDiv!.classList.add("badgecolor-blue");
      }
      else if(this.unreadNotifications < 10) {
        badgeDiv!.classList.add("badgecolor-yellow");
      }
      else {
        badgeDiv!.classList.add("badgecolor-red");
      }

    }
  }

}
