import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit {
  
  unreadNotifications: number = 0;
  
  constructor() { }

  ngOnInit(): void {
    
  }

}
