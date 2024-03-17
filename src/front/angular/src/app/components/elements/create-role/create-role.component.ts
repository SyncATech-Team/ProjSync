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

  constructor(public bsModalRef: BsModalRef) { }
}
