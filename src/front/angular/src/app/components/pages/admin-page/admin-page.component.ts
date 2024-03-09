import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.css'
})
export class AdminPageComponent {


  visible : boolean = false;

  showhidden(){
    this.visible = this.visible?false:true;
  }

}
