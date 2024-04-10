import { Component, Injectable } from '@angular/core';

interface SideNavToggle{
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})

/**
 * Obezbediti komponentu da bude injectable
 */
@Injectable({
  providedIn: 'root'
})

export class AdminPageComponent {
  
  // PROPERTIES
  isSideNavCollapsed = false;
  screenWidth = 0;

  visibleUser : boolean = false;
  visibleRole : boolean = false;
  
  // METHODS

  /**
   * Konstruktor
   */
  constructor() { }

  /**
   * Expand & Collapse sidenav bar-a
   * @param data 
   */
  onToggleSideNav(data: SideNavToggle) {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
}