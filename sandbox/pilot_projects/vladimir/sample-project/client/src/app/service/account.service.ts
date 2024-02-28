import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = 'http://localhost:5000/api/';

  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  // pri instanciranju, ubacujemo http client
  constructor(private http: HttpClient) { }

  login(model: any) {
    // POST: http://localhost:5000/api/account/login, a model se salje unutar body post metode
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          // lokalno skladistenje korisnika
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    )
  }

  setCurrentUser(user: User) {
    this.currentUserSource.next(user);
  }

  logout() {
    // kad se odjavimo, izbacujemo korisnika iz skladista
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
