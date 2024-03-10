import { Component } from '@angular/core';
import { AccountService } from '../../../_service/account.service';

interface Role{
    Name : string,
    WorkingHourPrice : number ,
    OvertimeHourPrice : number,
    WeekendHourPrice : number
}


@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrl: './create-role.component.css'
})
export class CreateRoleComponent {

  role : Role={
    Name : "",
    WorkingHourPrice : 0,
    OvertimeHourPrice : 0,
    WeekendHourPrice :0
  }

  create(){
    // Implementirati
  }

}
