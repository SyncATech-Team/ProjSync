import { Injectable } from "@angular/core";
import { ChatPreview } from "../_models/chat-preview.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { MessageSendDto } from "../_models/message-send.model";
import { AccountService } from "./account.service";

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    baseUrl = environment.apiUrl;

    constructor(
        private http: HttpClient,
        private accountService: AccountService
    ) { }

    public getUsersPreviousChats(userId: string): Observable<ChatPreview[]> {
        return this.http.get<ChatPreview[]>(`${this.baseUrl}Chat/user/${userId}`);
    }

    public sendMessage(model: MessageSendDto): Observable<any> {
        return this.http.post(`${this.baseUrl}Chat/send/`, model);
    }

    public getMessages(loggedInUserUsername: string, otherUserUsername: string): Observable<MessageSendDto[]> {
        return this.http.get<MessageSendDto[]>(`${this.baseUrl}Chat/chat/${loggedInUserUsername}/${otherUserUsername}`);
    }

    public getUnreadMessages(): Observable<number> {
        let username = this.accountService.getCurrentUser()?.username;
        return this.http.get<number>(`${this.baseUrl}Chat/chat/${username}/unread`);
    }

    public markMessagesAsRead(loggedInUserUsername: string, otherUserUsername: string): Observable<any> {
        return this.http.get(`${this.baseUrl}Chat/chat/${loggedInUserUsername}/${otherUserUsername}/markread`);
    }

}