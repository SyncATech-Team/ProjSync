import { Component } from '@angular/core';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  
  close_invalid_login_popup() {
    let x = document.getElementById("invalid_login_div");
    if(x != null) x.hidden = true;
  }

}
