import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserProfilePicture {

    baseUrl = environment.apiUrl;
    profilePictureChanged = new EventEmitter<string>();

    constructor(private http: HttpClient) { }

    getUserImage(username: string) {
        return this.http.get<any>(`${this.baseUrl}Images/user/${username}/image`);
    }

    uploadUserImage(username: string, imageFile: File) {
        const formData: FormData = new FormData();
        formData.append('imageFile', imageFile, imageFile.name);
        return this.http.post<any>(this.baseUrl + 'Images/user/' + username, formData);
    }
}