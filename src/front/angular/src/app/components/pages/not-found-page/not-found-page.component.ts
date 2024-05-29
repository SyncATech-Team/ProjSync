import { Component } from '@angular/core';
import { LocalService } from '../../../_service/local.service';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.css'
})
export class NotFoundPageComponent {
  path:string='';
  page:string='';

  constructor(private localService: LocalService){

    if (typeof localStorage != 'undefined') {

      var storage = this.localService.getData('user');
      if(storage) {
        var user = JSON.parse(storage);
        if (user['token']) {
          this.page = "home page";
          this.path = "/home";
        }
        if (user.roles.includes("Admin")){
          this.page = "admin page";
          this.path = "/admin/user"
        }
      }
      else{
        this.page = "login page";
      }
    }
  }
}
