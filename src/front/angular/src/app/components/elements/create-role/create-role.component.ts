import { Component } from '@angular/core';
import { CompanyroleService } from '../../../_service/companyrole.service';
import { CreateCompanyRole } from '../../../_models/create-company-role';

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

  constructor(public companyRoleService: CompanyroleService) { }

  create(){
    this.companyRoleService.create(this.role);
  }

}
