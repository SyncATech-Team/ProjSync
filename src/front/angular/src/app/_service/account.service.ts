import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../_models/user';
import { CreateCompanyRole } from '../_models/role';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = 'https://localhost:5000/api/'; // Zamenjen "http"->"https" kako bi radio register

  private currentUserSource = new BehaviorSubject<User | null>(null);
  private RoleSource = new BehaviorSubject<CreateCompanyRole | null>(null);
  currentUser$ = this.currentUserSource.asObservable();
  
  constructor(private http: HttpClient) { }

  login(model: any) {
    // POST: http://localhost:5000/api/account/login, model se salje preko body-ja
    // od http klijenta dobijamo Observable i vraca nam se UserDto
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(

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
    // POST: http://localhost:5000/api/account/register, model se salje preko body-ja
    // od http klijenta dobijamo Observable i vraca nam se UserDto
    return this.http.post<User>(this.baseUrl + 'Users/register', model).pipe( // Zamenjen "account/register"->"Users/register" kako bi register radio
      map(user => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    )
  }

  create(model: any) {
    // POST: http://localhost:5000/api/account/register, model se salje preko body-ja
    // od http klijenta dobijamo Observable i vraca nam se UserDto
    return this.http.post<CreateCompanyRole>(this.baseUrl + 'Companyroles', model).pipe( 
      map(role => {
        if (role) {
          localStorage.setItem('role', JSON.stringify(role));
          this.RoleSource.next(role);
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
