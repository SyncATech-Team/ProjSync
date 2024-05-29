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
import { TranslateService } from "@ngx-translate/core";

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    hubUrl = environment.hubUrl;
    hubConnection?: signalR.HubConnection;

    constructor(
        private msgPopupService: MessagePopupService,
        private translateService: TranslateService
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
            this.translateService.get('general.new-notification').subscribe((res: string) => {
                this.msgPopupService.showInfo(res);
            });
            NotificationComponent.increaseNumberOfUnreadMessages();
            NotificationsPageComponent.NewNotificationAdded();
        });

        this.hubConnection.on('ReceiveChatMessage', (data: MessageSendDto) => {
            if(data.senderUsername != ChatPageComponent._loggedInUser?.username) {
                this.translateService.get('general.new-message').subscribe((res: string) => {
                    this.msgPopupService.showInfo(res);
                });
                ChatElementComponent.increaseNumberOfUnreadMessages();
            }
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