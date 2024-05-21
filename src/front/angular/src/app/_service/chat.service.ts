import { Injectable } from "@angular/core";
import { ChatPreview } from "../_models/chat-preview.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { MessageSendDto } from "../_models/message-send.model";

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    baseUrl = environment.apiUrl;

    constructor(
        private http: HttpClient
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

}