import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { AccountService } from "./account.service";
import { Notification } from "../_models/notification.model";

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
        return this.http.get<number>(`${this.baseUrl}Notification/user/${username}/count`);
    }

    getUserNotifications() {
        let username = this.accountService.getCurrentUser()?.username;
        return this.http.get<Notification[]>(`${this.baseUrl}Notification/user/${username}/notifications`);
    }

    deleteNotification(notificationId: number) {
        return this.http.delete<boolean>(`${this.baseUrl}Notification?id=${notificationId}`);
    }

    deleteUserNotifications() {
        let username = this.accountService.getCurrentUser()?.username;
        return this.http.delete<boolean>(`${this.baseUrl}Notification/deleteforuser/${username}`);
    }

}