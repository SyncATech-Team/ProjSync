import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountService } from './service/account.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Demo aplikacija!';
  users: any;
  
  constructor(private http: HttpClient, private accountService: AccountService) { }

  // Kada komponenta implementira OnInit, mora da implementira metodu,
  // a tu ubacujemo inicijalni kod
  ngOnInit(): void {
    this.getUsers();
    this.setCurrentUser();
  }

  getUsers() {
    // this.http.get nam vraca Observable, zato moramo da uradimo subscribe
    // i onda imamo tri dela next: kada se vrati odziv, 
    // error: ukoliko se desila greska u ovom delu je obradjujemo i completed: kada je zavrsen zahtev
    this.http.get("http://localhost:5000/api/users").subscribe({
      next: response => this.users = response,
      error: error => console.log(error),
      complete: () => console.log('Zahtev je zavrsen!')
    })
  }

  setCurrentUser() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user: User = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }
}
