import { Component, Output, EventEmitter, HostListener, Input } from '@angular/core';
import { navbarData } from './nav-data';
import { AccountService } from '../../../_service/account.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  @Input() projectName: string | null = '';

  constructor(public accoutService: AccountService, private router: Router,private route: ActivatedRoute) { 
    this.screenWidth = window.innerWidth;
    this.setCollapsedState();
    this.projectName = route.snapshot.paramMap.get('projectName');
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
}
