import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { User } from '../_models/user';
import { HttpClient } from '@angular/common/http';
import { RegisterModel } from '../_models/register-user';
import { environment } from '../../environments/environment';
import { UserGetter } from '../_models/user-getter';
import { ResetPassword } from '../_models/reset-password';
import { ResetPasswordAfterEmailConformation } from '../_models/reset-password-response';
import { AuthUserChangePassword } from '../_models/change-passowrd-auth-user';
import { PresenceService } from './presence.service';
import { NotificationService } from './notification.service';
import { ForgotPasswordModel } from '../_models/forgot-password';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private presenceService: PresenceService,
    private notificationService: NotificationService
  ) { }

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
    
    /**
     * This modification ensures that the function gracefully handles
     * scenarios where localStorage is not available, returning null in such cases.
     * This approach is particularly useful when running TypeScript code in
     * environments where browser-specific features like localStorage are not available.
     */
    if (typeof localStorage === 'undefined') {
      return null; // localStorage is not available, return null
    }

    var storage = localStorage.getItem("user");
    if(!storage) return null;

    var user = JSON.parse(storage);
    return {
      username: user['username'],
      id: user['id'],
      token: user['token'],
      roles: user['roles'],
      permitions: user['permitions']
    }
  }

  setCurentUser(user: User) {
    user.roles = [];
    const decoded = this.getDecodedToken(user.token);
    const roles = decoded.role;
    const permitions = decoded.permitions;
    // korisnik moze da ima jednu ili vise uloga, zato pravimo niz
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    user.permitions = permitions;
    localStorage.setItem('user', JSON.stringify(user));
  }

  register(model: RegisterModel) {
    // POST: http://localhost:5000/api/Account/register, model se salje preko body-ja
    // od http klijenta dobijamo Observable i vraca nam se UserDto
    return this.http.post<UserGetter>(this.baseUrl + 'Account/register', model);
  }

  confirmEmail(email: string | null, token: string | null) {
    return this.http.post<ResetPasswordAfterEmailConformation>(this.baseUrl + `account/confirm-email?email=${email}&token=${token}`, {})
      .pipe(
        map((response: ResetPasswordAfterEmailConformation) => {
          localStorage.setItem('pass-reset', JSON.stringify(response));
        })
      );
  }

  // zaboravljena lozinka - pozvati endpoint koji ce da posalje mejl korisniku ako postoji u bazi
  forgotPassword(model: ForgotPasswordModel) {
    return this.http.post(this.baseUrl + `account/forgot-password`, model);
  }

  resetPassword(model: ResetPassword) {
    return this.http.post<User>(this.baseUrl + `Account/reset-password`, model).pipe(
      map((response: User) => {
        const user = response;

        if (user) {
          // zapamti korisnika lokalno
          this.setCurentUser(user);
        }
      })
    );
  }

  resendLink(model: ForgotPasswordModel) {
    return this.http.post(this.baseUrl + "Account/resend-link", model);
  }

  changePasswordForAuthorizedUser(model: AuthUserChangePassword) {
    return this.http.post<string>(this.baseUrl + "Account/change-password-auth-user", model);
  }

  logout() {
    // izbrisati iz lokalne memorije
    localStorage.removeItem('user');
    this.presenceService.stopHubConnection();
    this.notificationService.stopHubConnection();
  }

  getDecodedToken(token: string) {
    // dekodujemo drugi deo tokena
    return JSON.parse(atob(token.split('.')[1]));
  }
}
