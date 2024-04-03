import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserProfilePicture {

    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getUserImage(username: string) {
        return this.http.get<any>(`${this.baseUrl}Images/user/${username}/image`);
    }

    uploadUserImage(username: string, imageFile: File) {
        const formData: FormData = new FormData();
        formData.append('imageFile', imageFile, imageFile.name);
        return this.http.post<any>(this.baseUrl + 'Images/user/' + username, formData);
    }

    decodeBase64Image(base64String: string) {
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        return URL.createObjectURL(blob);
    }


  MAX_NUMBER_OF_DEFAULT_IMAGES = 10;
  /**
   * Funkcija koja vraca random generisani broj u opsegu min-max
   * @param min minimum
   * @param max maksimum
   * @returns generisani random broj
   */
  getRandomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  /**
   * Osnovna ideja ove funkcije je da vrati putanju predefinisanu za korisnika koji nema uploadovanu profilnu sliku.
   * Kako bi se dodatno postigla raznolikost defaultnih profilnih slika, one se mogu odrediti na osnovu korisnickog imena
   * kao ostatak pri deljenju sume svih karaktera i broja predefinisanih slika
   * @param username 
   * @returns 
   */
  getDefaultImageForUser(username: string) {
    let usernameSumOfCharacters: number = 0;
    
    for (let index = 0; index < username.length; index++) {
      usernameSumOfCharacters += username.charCodeAt(index);
    }

    let defaultImageNumber = usernameSumOfCharacters % this.MAX_NUMBER_OF_DEFAULT_IMAGES + 1;
    let path = "../../assets/images/DefaultAccountProfileImages/default_account_image_" + defaultImageNumber + ".png";
    return path;
  }

  getFirstDefaultImagePath() {
    return "../../assets/images/DefaultAccountProfileImages/default_account_image_1.png";
  }
}