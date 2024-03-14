import { Component, Output, EventEmitter } from '@angular/core';
import { AccountService } from '../../../_service/account.service';
import { AdminPageComponent } from '../../pages/admin-page/admin-page.component';
import { CompanyroleService } from '../../../_service/companyrole.service';
import { CreateCompanyRole } from '../../../_models/create-company-role';
import { CompanyRole } from '../../../_models/company-role';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrl: './create-role.component.css'
})
export class CreateRoleComponent {

  role: CreateCompanyRole = {
    name: '',
    workingHourPrice: 0,
    overtimeHourPrice: 0,
    weekendHourPrice: 0
  }

  constructor(public companyRoleService: CompanyroleService, private adminPage: AdminPageComponent) { }

  @Output() roleCreated = new EventEmitter<CompanyRole>();

  create(){
    this.companyRoleService.create(this.role).subscribe({
      next: () => {
        let y = document.getElementById("valid_role_div");
        if(y != null) y.hidden = false;

        let x = document.getElementById("invalid_role_div");
        if(x != null) x.hidden = true;

        this.roleCreated.emit(this.role);
      },

      error: () => {
        // prikazi poruku greske
        let x = document.getElementById("invalid_role_div");
        if(x != null) x.hidden = false;

        let y = document.getElementById("valid_role_div");
        if(y != null) y.hidden = true;
      }
    })
  }

  close_alerts() {
    this.adminPage.close_all_alerts();
  }

}
