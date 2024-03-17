import { Component, Output, EventEmitter } from '@angular/core';
import { AccountService } from '../../../_service/account.service';
import { AdminPageComponent } from '../../pages/admin-page/admin-page.component';
import { CompanyroleService } from '../../../_service/companyrole.service';
import { CompanyRole } from '../../../_models/company-role';
import { RolePageComponent } from '../../pages/admin-page/role-page/role-page.component';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrl: './create-role.component.css'
})
export class CreateRoleComponent {
  createdRole: CompanyRole | undefined;

  constructor(public bsModalRef: BsModalRef) { }
}
