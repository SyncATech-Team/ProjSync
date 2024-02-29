import { Component, OnInit } from '@angular/core';
import { Citizen } from '../../../models/citizen.model';
import { CitizensService } from '../../../services/citizens.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-add-citizen',
  templateUrl: './add-citizen.component.html',
  styleUrl: './add-citizen.component.css'
})
export class AddCitizenComponent implements OnInit {

  addCitizenRequest: Citizen = {
    umcn: '',
    name: '',
    email: '',
    phone: 0,
    address: ''
  };

  constructor(private citizenService: CitizensService, private router: Router) { }

  ngOnInit(): void {
      
  }

  addCitizen(){
    this.citizenService.addCitizen(this.addCitizenRequest)
    .subscribe({
      next: (citizen) => {
        this.router.navigate(['citizens']);
      }
    });
  }

}
