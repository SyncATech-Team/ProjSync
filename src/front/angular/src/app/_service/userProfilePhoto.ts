import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserProfilePicture {

    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getUserImage(username: string) {
        return this.http.get<any>(`${this.baseUrl}Images/user/${username}/image`);
        // 'https://localhost:5000/api/Images/user/nemanja/image'
    }

    uploadUserImage(username: string, imageFile: File): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('imageFile', imageFile, imageFile.name);
        return this.http.post<any>(this.baseUrl + 'user/' + username, formData);
    }
}