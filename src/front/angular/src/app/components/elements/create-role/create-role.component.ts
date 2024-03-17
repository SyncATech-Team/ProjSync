import { Component, Output, EventEmitter } from '@angular/core';
import { AccountService } from '../../../_service/account.service';
import { AdminPageComponent } from '../../pages/admin-page/admin-page.component';
import { CompanyroleService } from '../../../_service/companyrole.service';
import { CompanyRole } from '../../../_models/company-role';
import { RolePageComponent } from '../../pages/admin-page/role-page/role-page.component';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrl: './create-role.component.css'
})
export class CreateRoleComponent {

  role: CompanyRole = {
    name: ''
  }

  constructor(public companyRoleService: CompanyroleService, private rolePage: RolePageComponent) { }
  
  //@Output() roleCreated = new EventEmitter<CompanyRole>();

  create() {
    this.companyRoleService.create(this.role).subscribe({
      next: () => {
        this.rolePage.showSuccess("Successfully created new role");
        //this.roleCreated.emit(this.role);
      },

      error: () => {
        // prikazi poruku greske
        this.rolePage.showError("Unable to create new role with given parameters. Probably duplicate names");
      }
    })
  }

  // close_alerts() {
  //   this.adminPage.close_all_alerts();
  // }

}
