import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../_service/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {

  constructor(public accoutService: AccountService) { }

  ngOnInit(): void {
    
  }
}
