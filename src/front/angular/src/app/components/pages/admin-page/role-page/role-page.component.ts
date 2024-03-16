import { Component, OnInit } from '@angular/core';
import { CompanyRole } from '../../../../_models/company-role';
import { CompanyroleService } from '../../../../_service/companyrole.service';
import { Table } from 'primeng/table';
import * as FileSaver from 'file-saver';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-role-page',
  templateUrl: './role-page.component.html',
  styleUrl: './role-page.component.css'
})
export class RolePageComponent implements OnInit {

  roles: string[] = [];
  roles_backup: string[] = [];

  cols!: Column[];
  exportColumns!: ExportColumn[];
  
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

    this.cols = [
      { field: 'role', header: 'List of company roles', customExportHeader: 'Company role name' },
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));

    console.log(this.exportColumns);
  }

  onRoleCreated(role: CompanyRole) {
    this.roles.push(role.name);  // Add the new user to the users array
    this.roles_backup.push(role.name);
  }

  onRoleDeleted(role: CompanyRole) {

  }

  deleteCompanyRole(name: string) {
    const response = prompt("In order to delete role please enter [" + name + "]");
    if(response != name) return;

    this.croleService.deleteRole(name).subscribe({
      next: response => {
        // Use the findIndex method to efficiently locate the index of the role to remove
        const indexToRemove = this.roles.findIndex(role => role === name);
        // If the role is found, efficiently remove it using splice
        if (indexToRemove !== -1) {
          this.roles.splice(indexToRemove, 1);
        }
      }
    });

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

  exportPdf() {
    import('jspdf').then((jsPDF) => {
        import('jspdf-autotable').then((x) => {
            const doc = new jsPDF.default('p', 'px', 'a4');
            (doc as any).autoTable(this.exportColumns, this.roles);
            doc.save('roles.pdf');
        });
    });
  }

}
