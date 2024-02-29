import { Component, OnInit } from '@angular/core';
import { Citizen } from '../../../models/citizen.model';
import { CitizensService } from '../../../services/citizens.service';


@Component({
  selector: 'app-citizens-list',
  templateUrl: './citizens-list.component.html',
  styleUrl: './citizens-list.component.css'
})
export class CitizensListComponent implements OnInit{
  citizens: Citizen[] = [];
  constructor(private citizensService: CitizensService) { }

  ngOnInit(): void {
     this.citizensService.getAllCitizens()
     .subscribe({
      next: (citizens) => {
        this.citizens = citizens;
      },
      error: (response) => {
        console.log(response);
      }
     })
  }
}
