import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { AccountService } from "./account.service";

@Injectable({
    providedIn: 'root'
})
export class NotificationControllerService {

    baseUrl = environment.apiUrl;

    constructor(
        private http: HttpClient,
        private accountService: AccountService
    ) {

    }

    getNotificationCount() {
        let username = this.accountService.getCurrentUser()?.username;
        return this.http.get<number>(`${this.baseUrl}Notification/user/${username}`);
    }

}