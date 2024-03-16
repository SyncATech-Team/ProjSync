import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserGetter } from '../_models/user-getter';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }
  
  getAllUsers() {
    return this.http.get<UserGetter[]>(this.baseUrl + "Users");
  }
}
