import { Component } from '@angular/core';
import { AdminPageComponent } from '../../pages/admin-page/admin-page.component';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css'
})
export class AdminSidebarComponent {

  constructor(private adminPage: AdminPageComponent) { }

  showUsersPage() {
    this.adminPage.hide_all_pages();
    let x = document.getElementById("users");
    if(x != null) x.hidden = false;
  }

  showCompanyRolesPage() {
    this.adminPage.hide_all_pages();
    let x = document.getElementById("company_roles");
    if(x != null) x.hidden = false;
  }

}
