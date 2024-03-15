import { Component, OnInit } from '@angular/core';
import { CompanyRole } from '../../../../_models/company-role';
import { CompanyroleService } from '../../../../_service/companyrole.service';

@Component({
  selector: 'app-role-page',
  templateUrl: './role-page.component.html',
  styleUrl: './role-page.component.css'
})
export class RolePageComponent implements OnInit {

  roles: string[] = [];

  constructor(private croleService: CompanyroleService) {}

  ngOnInit(): void {
    this.croleService.getAllCompanyRoles().subscribe({
      next: response => {
        this.roles = response;
      },
      error: error => {
        console.log("ERROR: " + error.error);
      }
    });
  }

  onRoleCreated(role: CompanyRole) {
    this.roles.push(role.name);  // Add the new user to the users array
  }

}
