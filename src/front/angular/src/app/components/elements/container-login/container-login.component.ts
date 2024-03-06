import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../_service/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'container-login',
  templateUrl: './container-login.component.html',
  styleUrl: './container-login.component.css'
})
export class ContainerLoginComponent implements OnInit {
  model : any = {
    username:  "",
    password:  ""
  }

  constructor(public accoutService: AccountService, private router: Router) { }

  ngOnInit(): void {
    
  }

  login() {
    // dobili smo Observable, moramo da uradimo subscribe da bismo koristili
    this.accoutService.login(this.model).subscribe({
      next: () => this.router.navigateByUrl('/home'),

      // TODO: Prikazati gresku kada npr korisnik unese pogresnu lozinku ili username
      error: error => console.log(error)
    })
  }
}
