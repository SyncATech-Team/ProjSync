import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found-page',
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.css'
})
export class NotFoundPageComponent {
  logged:boolean=false;
  isAdmin:boolean=false;
  constructor(){
    if (typeof localStorage != 'undefined') {
      var storage = localStorage.getItem("user");
      if(storage) {
        var user = JSON.parse(storage);
        if (user['token']) 
          this.logged = true;
        if (user.roles.includes("Admin"))
          this.isAdmin = true;
      }
    }
  }
}
