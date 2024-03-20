import { Component, Output, EventEmitter } from '@angular/core';
import { navbarData } from './nav-data';
import { AccountService } from '../../../_service/account.service';
import { Router } from '@angular/router';

interface SideNavToggle{
  screenWidth : number;
  collapsed: boolean;
}

@Component({
  selector: 'app-project-sidebar',
  templateUrl: './project-sidebar.component.html',
  styleUrl: './project-sidebar.component.css'
})
export class ProjectSidebarComponent {
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
}
