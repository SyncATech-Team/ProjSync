import { Injectable } from "@angular/core";
import * as signalR from "@microsoft/signalr";
import { environment } from "../../environments/environment";
import { User } from "../_models/user";
import { MessagePopupService } from "./message-popup.service";

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
    public createHubConnection(user: User) {
        this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(this.hubUrl + 'notification', {
            accessTokenFactory: () => user.token
        })
        .withAutomaticReconnect()
        .build();

        this.hubConnection
        .start()
        .then(() => console.log("Connection to NotificationHub started..."))
        .catch((error: Error) => {
            console.log(error);
        });

        this.hubConnection.on('ReceiveTaskNotification', (data: string) => {
            this.msgPopupService.showInfo(data);
        });
    }
}