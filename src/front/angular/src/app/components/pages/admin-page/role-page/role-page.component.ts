import { Component, OnInit } from '@angular/core';
import { CompanyRole } from '../../../../_models/company-role';
import { CompanyroleService } from '../../../../_service/companyrole.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-role-page',
  templateUrl: './role-page.component.html',
  styleUrl: './role-page.component.css'
})
export class RolePageComponent implements OnInit {

  roles: string[] = [];
  roles_backup: string[] = [];
  
  first = 0;
  rows = 10;
  loading: boolean = true;
  activityValues: number[] = [0, 100];

  constructor(private croleService: CompanyroleService) {}

  ngOnInit(): void {
    this.loading = false;
    this.croleService.getAllCompanyRoles().subscribe({
      next: response => {
        this.roles = response;
        this.roles_backup = response;
      },
      error: error => {
        console.log("ERROR: " + error.error);
      }
    });
  }

  onRoleCreated(role: CompanyRole) {
    this.roles.push(role.name);  // Add the new user to the users array
    this.roles_backup.push(role.name);
  }

  // SERCH
  clear(table: Table) {
    table.clear();
    this.roles = this.roles_backup;
  }

  filerApply(event: any): void {
    let tekst: string = "";
    if(event.target.value != null) {
      tekst = event.target.value;
    }

    console.log(tekst);
  }

  search(table: Table) {
    this.roles = this.roles_backup;
    let x = document.getElementById("search-input-term-roles-global") as HTMLInputElement;
    let searchTerm = x.value.toLowerCase();
    this.roles = this.roles.filter(x => x.toLowerCase().includes(searchTerm));
  }

  // END SEARCH

  // PAGINATOR FUNCTIONS
  next() {
    if(this.first + this.rows <= this.roles.length)
      this.first = this.first + this.rows;
  }

  prev() {
      this.first = this.first - this.rows;
  }

  reset() {
      this.first = 0;
  }

  pageChange(event: any) {
      this.first = event.first;
      this.rows = event.rows;
  }

  isLastPage(): boolean {
      return this.roles ? this.first === this.roles.length - this.rows : true;
  }

  isFirstPage(): boolean {
      return this.roles ? this.first === 0 : true;
  }
  // PAGINATOR FUNCTIONS

}
