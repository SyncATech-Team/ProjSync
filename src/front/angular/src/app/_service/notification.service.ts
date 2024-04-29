import { Injectable } from "@angular/core";
import * as signalR from "@microsoft/signalr";
import { environment } from "../../environments/environment";
import { User } from "../_models/user";
import { MessagePopupService } from "./message-popup.service";
import { NotificationComponent } from "../components/elements/notification/notification.component";
import { NotificationsPageComponent } from "../components/pages/notifications-page/notifications-page.component";

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    hubUrl = environment.hubUrl;
    hubConnection?: signalR.HubConnection;

    constructor(
        private msgPopupService: MessagePopupService
    ) { }

    /**
     * createHubConnection
     */
    private createHubConnection(user: User) {
        
        let options = {
            accessTokenFactory: () => user.token
        };
        
        this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(this.hubUrl + 'notification', options)
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();
        
        
        this.hubConnection
            .start()
            .then(() => {})
            .catch((error: Error) => {
                console.log(error.message);
            });
        
        this.hubConnection.on('ReceiveTaskNotification', (data: string) => {
            this.msgPopupService.showInfo("You have a new task assigned to you. Check it out.");
            NotificationComponent.increaseNumberOfUnreadMessages();
            NotificationsPageComponent.NewNotificationAdded();
        });

        this.hubConnection.onclose(() => {
            console.log("Connection to NotificationHub closed");
            this.createHubConnection(user);
        })

        this.hubConnection.onreconnecting(() => {
            console.log("Reconnecting to the notification hub...");
        })

    }

    stopHubConnection() {
        this.hubConnection?.stop().catch((error: Error) => {console.log(error)});
    }

    public createConnection(user: User) {
        if( this.hubConnection == undefined || 
            this.hubConnection.state == "Disconnected"
        ) {
            this.createHubConnection(user);
        }
        else {
            console.log("NotificationHub Connection State: " + this.hubConnection.state);
        }
    }

}