import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'container-login',
  templateUrl: './container-login.component.html',
  styleUrl: './container-login.component.css'
})
export class ContainerLoginComponent {
  user : any = {
    username:  "",
    password:  ""
  }
}
