import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CitizensService } from '../../../services/citizens.service';
import { Citizen } from '../../../models/citizen.model';

@Component({
  selector: 'app-edit-citizen',
  templateUrl: './edit-citizen.component.html',
  styleUrl: './edit-citizen.component.css'
})
export class EditCitizenComponent implements OnInit {

  citizenDetails: Citizen = {
    umcn: '',
    name: '',
    email: '',
    phone: 0,
    address: ''
  };

  constructor(private route: ActivatedRoute, private citizenService: CitizensService, private router: Router) { }

  ngOnInit(): void {
      this.route.paramMap.subscribe({
        next: (params) => {
          const umcn = params.get('umcn');

          if(umcn){
            this.citizenService.getCitizen(umcn)
            .subscribe({
              next: (response) => {
                this.citizenDetails = response;

              }
            })
          }
        }
      })
  }

  updateCitizen(){
    this.citizenService.updateCitizen(this.citizenDetails.umcn, this.citizenDetails)
    .subscribe({
      next: (response) => {
        this.router.navigate(['citizens']);
      }
    });
  }

  deleteCitizen(umcn: string){
    this.citizenService.deleteCitizen(umcn)
    .subscribe({
      next: (response) => {

        this.router.navigate(['citizens']);
      }

    });
  }

}
