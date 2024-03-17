import { Component, Output, EventEmitter } from '@angular/core';
import { AdminPageComponent } from '../../pages/admin-page/admin-page.component';
import { AccountService } from '../../../_service/account.service';
import { navbarData } from './nav-data';
import { Router } from '@angular/router';

interface SideNavToggle{
  screenWidth : number;
  collapsed: boolean;
}
@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css'
})
export class AdminSidebarComponent {

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();

  //TRUE -> otvoren side nav
  //FALSE -> zatvoren side nav
  collapsed : boolean = false;
  screenWidth = 0;
  navData = navbarData;

  constructor(public accoutService: AccountService, private router: Router) { }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  closeSidenav() {
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  logout() {
    this.accoutService.logout();
    this.router.navigateByUrl('/');
  }
}
