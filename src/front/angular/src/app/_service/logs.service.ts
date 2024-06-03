import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import * as signalR from "@microsoft/signalr";
import { User } from "../_models/user";
import { HttpClient } from "@angular/common/http";
import { Log } from "../_models/log.model";

@Injectable({
    providedIn: 'root'
})
export class LogsService {

    baseUrl = environment.apiUrl;
    hubUrl = environment.hubUrl;
    hubConnection?: signalR.HubConnection;

    constructor(
        private http: HttpClient
    ) {}

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

        })
    }

    stopHubConnection() {

        this.hubConnection?.stop().catch((error: Error) => {console.log(error)});
    }

    public createConnection(user: User) {
        if( this.hubConnection == undefined || this.hubConnection.state == "Disconnected" ) {
            this.createHubConnection(user);
        }
        else {
        }
    }

    public getLogsCount(projectName: string) {
        return this.http.get<number>(`${this.baseUrl}Logs/count/${projectName}`);
    }

    public getLogsRange(projectName: string, start: number, end: number) {
        return this.http.get<Log[]>(`${this.baseUrl}Logs/logs/${projectName}?start=${start}&end=${end}`);
    }

}