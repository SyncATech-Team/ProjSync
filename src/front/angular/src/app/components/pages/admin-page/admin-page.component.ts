import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent {


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
}
