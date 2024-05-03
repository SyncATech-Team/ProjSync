import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import * as signalR from "@microsoft/signalr";
import { User } from "../_models/user";

@Injectable({
    providedIn: 'root'
})
export class LogsService {

    hubUrl = environment.hubUrl;
    hubConnection?: signalR.HubConnection;

    constructor() {

    }

    private createHubConnection(user: User) {
        let options = {
            accessTokenFactory: () => user.token
        };

        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(this.hubUrl + 'logs', options)
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.hubConnection
            .start()
            .then(() => {})
            .catch((error: Error) => {
                console.log(error.message);
            });

        this.hubConnection.onclose(() => {
            console.log("Connection to LogsHub closed");
        })
    }

    stopHubConnection() {
        console.log("Logs hub: Stopping hub connection...");
        this.hubConnection?.stop().catch((error: Error) => {console.log(error)});
    }

    public createConnection(user: User) {
        if( this.hubConnection == undefined || this.hubConnection.state == "Disconnected" ) {
            this.createHubConnection(user);
        }
        else {
            // console.log("LogsHub Connection State: " + this.hubConnection.state);
        }
    }

}