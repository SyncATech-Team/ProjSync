import { Component, OnInit } from '@angular/core';
import { NotificationControllerService } from '../../../_service/notification-controller.service';
import { Notification } from '../../../_models/notification.model';
import { NotificationComponent } from '../../elements/notification/notification.component';

@Component({
  selector: 'app-notifications-page',
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.css'
})
export class NotificationsPageComponent implements OnInit {

  static notifications: Notification[] = [];
  private static staticNotificationControllerService: NotificationControllerService;

  constructor(
    private notificationControllerService: NotificationControllerService
  ) {
    NotificationsPageComponent.staticNotificationControllerService = notificationControllerService;
  }

  ngOnInit(): void {
    NotificationsPageComponent.GetNotificationsFromDatabase();
  }

  private static GetNotificationsFromDatabase(): void {
    this.staticNotificationControllerService.getUserNotifications().subscribe({
      next: response => {
        console.log(response);
        this.notifications = response;
      },
      error: error => {
        console.log(error.error);
      }
    })
  }

  makeAllNotificationsAsRead() {
    if(NotificationComponent.getNumberOfUnreadNotifications() == 0) return;

    this.notificationControllerService.deleteUserNotifications().subscribe({
      next: _ => {
        NotificationComponent.resetoToZero();
        NotificationsPageComponent.notifications = [];
      },
      error: error => {
        console.log(error.error);
      }
    })
  }

  markNotificationAsRead(id: number) {
    this.notificationControllerService.deleteNotification(id).subscribe({
      next: response => {
        NotificationComponent.decreaseNumberOfUnreadMessages();
        let indexToRemove = NotificationsPageComponent.notifications.findIndex(notification => notification.id == id);
        if(indexToRemove !== -1) {
          NotificationsPageComponent.notifications.splice(indexToRemove, 1);
        }
      },
      error: error => {
        console.log(error.error);
      }
    })
  }

  get getNotifications(): Notification[] {
    return NotificationsPageComponent.notifications;
  }

  public static NewNotificationAdded() {
    this.GetNotificationsFromDatabase();
  }

}
