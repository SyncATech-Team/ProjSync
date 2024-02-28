import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = 'http://localhost:5000/api/';

  // pri instanciranju, ubacujemo http client
  constructor(private http: HttpClient) { }

  login(model: any) {
    // POST: http://localhost:5000/api/account/login, a model se salje unutar body post metode
    return this.http.post(this.baseUrl + 'account/login', model);
  }
}
