import { Injectable } from "@angular/core";
import { ChatPreview } from "../_models/chat-preview.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";

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
}