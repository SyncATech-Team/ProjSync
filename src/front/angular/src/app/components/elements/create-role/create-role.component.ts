import { Component } from '@angular/core';
import { AccountService } from '../../../_service/account.service';
import { AdminPageComponent } from '../../pages/admin-page/admin-page.component';

interface Role{
    Name : string,
    WorkingHourPrice : number | null,
    OvertimeHourPrice : number | null,
    WeekendHourPrice : number | null
}


@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrl: './create-role.component.css'
})
export class CreateRoleComponent {

  role : Role={
    Name : "",
    WorkingHourPrice : null,
    OvertimeHourPrice : null,
    WeekendHourPrice :null
  }

  constructor(public accoutService: AccountService, private adminPage: AdminPageComponent) { }

  create(){
    this.accoutService.create(this.role).subscribe({
      next: () => {
        let y = document.getElementById("valid_role_div");
        if(y != null) y.hidden = false;

        let x = document.getElementById("invalid_role_div");
        if(x != null) x.hidden = true;
      },

      error: (error) => {
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
