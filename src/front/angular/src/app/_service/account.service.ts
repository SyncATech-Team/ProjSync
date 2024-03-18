import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../_models/user';
import { HttpClient } from '@angular/common/http';
import { RegisterModel } from '../_models/register-user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;

  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();
  static currentUser$: any;
  
  constructor(private http: HttpClient) { }

  login(model: any) {
    // POST: http://localhost:5000/api/Account/login, model se salje preko body-ja
    // od http klijenta dobijamo Observable i vraca nam se UserDto
    return this.http.post<User>(this.baseUrl + 'Account/login', model).pipe(

      map((response: User) => {
        const user = response;

        if (user) {
          // zapamti korisnika lokalno
          this.setCurentUser(user);
        }
      })
    )
  }

  getCurrentUser(): User | null {
    var storage = localStorage.getItem("user");
    if(!storage) return null;

    var user = JSON.parse(storage);
    return {
      username: user['username'],
      token: user['token'],
      roles: user['roles']
    }
  }

  setCurentUser(user: User) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    // korisnik moze da ima jednu ili vise uloga, zato pravimo niz
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);

    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  register(model: RegisterModel) {
    // POST: http://localhost:5000/api/Account/register, model se salje preko body-ja
    // od http klijenta dobijamo Observable i vraca nam se UserDto
    return this.http.post<RegisterModel>(this.baseUrl + 'Account/register', model);
  }

  logout() {
    // izbrisati iz lokalne memorije
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  getDecodedToken(token: string) {
    // dekodujemo drugi deo tokena
    return JSON.parse(atob(token.split('.')[1]));
  }
}
