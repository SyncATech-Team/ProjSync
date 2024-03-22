import { Component, Output, EventEmitter, HostListener } from '@angular/core';
import { AccountService } from '../../../_service/account.service';
import { navbarData } from './nav-data';
import { Router } from '@angular/router';

interface SideNavToggle {
  screenWidth: number;
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
  collapsed: boolean = false;
  screenWidth = 0;
  navData = navbarData;

  constructor(public accountService: AccountService, private router: Router) {
    this.screenWidth = window.innerWidth;
    this.setCollapsedState();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.screenWidth = window.innerWidth;
    this.setCollapsedState();
  }

  setCollapsedState() {
    if (this.screenWidth > 960) {
      this.collapsed = true;
    } else {
      this.collapsed = false;
    }
    this.emitToggleEvent();
  }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  closeSidenav() {
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  emitToggleEvent() {
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
