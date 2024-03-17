import { Component, Output, EventEmitter } from '@angular/core';
import { CompanyRole } from '../../../_models/company-role';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrl: './create-role.component.css'
})
export class CreateRoleComponent {
  createdRole: CompanyRole | undefined;

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
