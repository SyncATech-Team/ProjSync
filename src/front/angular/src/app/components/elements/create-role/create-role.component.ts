import { Component } from '@angular/core';
import { AccountService } from '../../../_service/account.service';

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

  constructor(public accoutService: AccountService) { }

  create(){
    this.accoutService.create(this.role).subscribe()
  }

}
