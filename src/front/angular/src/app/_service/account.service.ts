import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../_models/user';
import { CreateCompanyRole } from '../_models/create-company-role';
import { HttpClient } from '@angular/common/http';
import { RegisterModel } from '../_models/register-user';
import { environment } from '../../environments/environment.development';
import { UserGetter } from '../_models/user-getter';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;

  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();
  
  constructor(private http: HttpClient) { }

  login(model: any) {
    // POST: http://localhost:5000/api/Account/login, model se salje preko body-ja
    // od http klijenta dobijamo Observable i vraca nam se UserDto
    return this.http.post<User>(this.baseUrl + 'Account/login', model).pipe(

      map((response: User) => {
        const user = response;

        if (user) {
          // zapamti korisnika lokalno
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    )
  }

  register(model: RegisterModel) {
    // POST: http://localhost:5000/api/Account/register, model se salje preko body-ja
    // od http klijenta dobijamo Observable i vraca nam se UserDto
    return this.http.post<RegisterModel>(this.baseUrl + 'Account/register', model);
  }

  getAllUsers() {
    return this.http.get<UserGetter[]>(this.baseUrl + "Users");
  }

  logout() {
    // izbrisati iz lokalne memorije
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
