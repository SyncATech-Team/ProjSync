import { Component, OnInit } from '@angular/core';
import { AccountService } from '../service/account.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  // model koji ce da se koristi za mapiranje iz forme
  model: any = {};

  constructor(public accoutService: AccountService) { }

  ngOnInit(): void {
    
  }
  
  login() {
    // dobijamo Observable objekat iz servisa, moramo da uradimo subscribe
    this.accoutService.login(this.model).subscribe({
      next: response => {
        console.log(response);
      },
      error: error => console.log(error)
    })
  }

  logout() {
    this.accoutService.logout();
  }
}
