import { Injectable } from "@angular/core";
import * as signalR from "@microsoft/signalr";
import { environment } from "../../environments/environment";
import { User } from "../_models/user";
import { MessagePopupService } from "./message-popup.service";
import { NotificationComponent } from "../components/elements/notification/notification.component";
import { NotificationsPageComponent } from "../components/pages/notifications-page/notifications-page.component";
import { ChatPageComponent } from "../components/pages/chat-page/chat-page.component";
import { MessageSendDto } from "../_models/message-send.model";
import { ChatElementComponent } from "../components/elements/chat-element/chat-element.component";

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
        
        this.hubConnection.on('ReceiveNotification', (data: string) => {
            this.msgPopupService.showInfo("You have a new notification. Check it out.");
            NotificationComponent.increaseNumberOfUnreadMessages();
            NotificationsPageComponent.NewNotificationAdded();
        });

        this.hubConnection.on('ReceiveChatMessage', (data: MessageSendDto) => {
            this.msgPopupService.showInfo("You have a new message. Check it out.");
            ChatElementComponent.increaseNumberOfUnreadMessages();
            ChatPageComponent.initialize(data);
        });

        this.hubConnection.onreconnecting(() => {
            console.log("Reconnecting to the notification hub...");
        })

    }

    stopHubConnection() {
        console.log("Notifications hub: Stopping hub connection...");
        this.hubConnection?.stop().catch((error: Error) => {console.log(error)});
    }

    public createConnection(user: User) {
        if( this.hubConnection == undefined || 
            this.hubConnection.state == "Disconnected"
        ) {
            this.createHubConnection(user);
        }
        else {
            // console.log("NotificationHub Connection State: " + this.hubConnection.state);
        }
    }

}