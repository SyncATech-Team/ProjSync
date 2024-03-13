import { Component, Output, EventEmitter } from '@angular/core';
import { AdminPageComponent } from '../../pages/admin-page/admin-page.component';
import { navbarData } from './nav-data';

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

  constructor() { }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  closeSidenav() {
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

}
