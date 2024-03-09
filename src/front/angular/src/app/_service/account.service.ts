import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../_models/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = 'https://localhost:5000/api/';

  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();
  
  constructor(private http: HttpClient) { }

  login(model: any) {
    // POST: http://localhost:5000/api/Users/login, model se salje preko body-ja
    // od http klijenta dobijamo Observable i vraca nam se UserDto
    return this.http.post<User>(this.baseUrl + 'Users/login', model).pipe(

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

  // TODO: registracija samo za admin stranu
  register(model: any) {
    // POST: http://localhost:5000/api/Users/register, model se salje preko body-ja
    // od http klijenta dobijamo Observable i vraca nam se UserDto
    return this.http.post<User>(this.baseUrl + 'Users/register', model).pipe(
      map(user => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    )
  }

  logout() {
    // izbrisati iz lokalne memorije
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
