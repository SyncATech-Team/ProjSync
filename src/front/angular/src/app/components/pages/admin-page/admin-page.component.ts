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

  close_invalid_register_popup() {
    let x = document.getElementById("invalid_register_div");
    if(x != null) x.hidden = true;
  }
}
