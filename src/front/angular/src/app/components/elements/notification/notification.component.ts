import { Component, Input } from '@angular/core';
import { nData } from './notification-data';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  @Input() notify_collapsed : boolean = false;
  
  notificationData = nData;
}
