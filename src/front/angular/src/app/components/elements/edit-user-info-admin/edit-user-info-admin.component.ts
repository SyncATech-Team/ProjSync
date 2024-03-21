import { Component, Input, OnInit } from '@angular/core';
import { UserGetter } from '../../../_models/user-getter';
import { UserPageComponent } from '../../pages/admin-page/user-page/user-page.component';
import { Observable } from 'rxjs';
import { CompanyRole } from '../../../_models/company-role';
import { CompanyroleService } from '../../../_service/companyrole.service';


@Component({
  selector: 'app-edit-user-info-admin',
  templateUrl: './edit-user-info-admin.component.html',
  styleUrl: './edit-user-info-admin.component.css'
})
export class EditUserInfoAdminComponent implements OnInit {

  @Input() className?: string;
  @Input() users?: UserGetter[];

  userForEdit?: UserGetter;
  
  editUser: UserGetter = {
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    companyRoleName: '',
    contactPhone: '',
    linkedinProfile: '',
    status: '',
    isVerified: false,
    preferedLanguage: ''
  };

  roles$: Observable<CompanyRole[]> | undefined;

  constructor(public companyRoleService: CompanyroleService) {}
  
  ngOnInit(): void {
    this.roles$ = this.companyRoleService.getAllCompanyRoleNames();
    this.connectModel();
  }

  connectModel() {
    this.userForEdit = this.users?.filter(user => user.username == this.className).at(0);
  }

  printConnected() {
    let x = document.getElementById("firstName") as HTMLInputElement;
    if(this.userForEdit) x.innerHTML = this.userForEdit?.firstName;
    else x.innerHTML = "TEST";
  }

}
