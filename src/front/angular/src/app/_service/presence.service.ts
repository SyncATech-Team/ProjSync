import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {HttpClient} from "@angular/common/http";
import {MessagePopupService} from "./message-popup.service";
import {User} from "../_models/user";
import {BehaviorSubject, Subject} from "rxjs";
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  public hubConnection?: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(
    private notificationService: NotificationService,
    private msgPopupService: MessagePopupService,
    private router: Router
  ) { }

  private createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
    .start()
    .then(() => {})
    .catch((error: Error) => {
      console.log(error);
    });

    this.hubConnection.on('UserIsOnline', username => {
      // this.msgPopupService.showInfo(username + ' has connected');
    });

    this.hubConnection.on('UserIsOffline', username => {
      // this.msgPopupService.showInfo(username + ' has disconnected');
    });

    this.hubConnection.on('GetOnlineUsers', usernames => {
      this.onlineUsersSource.next(usernames);
    });

    this.hubConnection.on('AccountDeactivated', _ => {
      localStorage.removeItem('user');
      this.stopHubConnection();
      this.notificationService.stopHubConnection();
      this.router.navigateByUrl("/");
    });

  }

  stopHubConnection() {
    this.hubConnection?.stop().catch((error: Error) => {console.log(error)});
  }

  public createConnection(user: User) {
    if(this.hubConnection == undefined || this.hubConnection.state == "Disconnected") {
      this.createHubConnection(user);
    }
    else {
    }
  }

}
