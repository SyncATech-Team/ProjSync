import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent {
  constructor() { }

  visibleUser : boolean = false;
  visibleRole : boolean = false;

  showhiddenUser(){
    this.visibleRole = false;
    this.visibleUser = this.visibleUser?false:true;
  }

  showhiddenRole(){
    this.visibleUser = false;
    this.visibleRole = this.visibleRole?false:true;
  }

  close_alert(getByid: string) {

    let x = document.getElementById(getByid);
    if(x != null) {
      x.hidden = true;
    }
  }
  
  close_all_alerts() {
    this.close_alert("invalid_register_div");
    this.close_alert("invalid_role_div");
    this.close_alert("valid_register_div");
    this.close_alert("valid_role_div");
  }

  hide_all_pages() {

    let x = document.getElementById("welcome");
    if(x != null) x.hidden = true;

    let y = document.getElementById("users");
    if(y != null) y.hidden = true;

    let z = document.getElementById("company_roles");
    if(z != null) z.hidden = true;
  }

}
