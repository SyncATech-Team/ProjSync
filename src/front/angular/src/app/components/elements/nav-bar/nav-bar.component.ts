import { Component } from '@angular/core';
import { AccountService } from '../../../_service/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  constructor(public accoutService: AccountService, private router: Router) { }
  
  logout() {
    this.accoutService.logout();
    this.router.navigateByUrl('/');
  }
}
