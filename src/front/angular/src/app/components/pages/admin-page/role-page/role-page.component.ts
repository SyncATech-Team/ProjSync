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

  /* PODACI CLANOVI */
  roles: CompanyRole[] = [];
  roles_backup: CompanyRole[] = [];

  cols!: Column[];
  exportColumns!: ExportColumn[];
  
  first = 0;
  rows = 10;
  loading: boolean = true;
  activityValues: number[] = [0, 100];

  /**
   * Konstruktor
   * @param croleService 
   */
  constructor(private croleService: CompanyroleService) {}

  /**
   * OnInit
   */
  ngOnInit(): void {
    this.loading = false;
    
    // Dohvati sve uloge koje postoje iz baze
    this.croleService.getAllCompanyRoleNames().subscribe({
      next: response => {
        this.roles = response.map(name => ({
          name,
          workingHourPrice: -1,
          overtimeHourPrice: -1,
          weekendHourPrice: -1
        }));
      },
      error: error => {
        console.log("ERROR: " + error.error);
      }
    });

    // IMPROVE - Potrebno doraditi - koristi se kako bi se exportovala tabela u nekom od formata
    this.cols = [
      { field: 'name', header: 'List of company roles', customExportHeader: 'Company role name' },
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  /**
   * Metod koji se poziva kada se insertuje nova uloga
   * @param role 
   */
  onRoleCreated(role: CompanyRole) {
    this.roles.push(role);  // Add the new user to the users array
    this.roles_backup = this.roles;
    // this.roles_backup.push(role.name); // izgleda da pravi problem, dodaje duple uloge kad se insertuje nova
  }

  /**
   * Metod za brisanje uloge u kompaniji [potencijalno treba unaprediti error-handleing]
   * @param name 
   * @returns 
   */
  deleteCompanyRole(name: string) {
    const response = prompt("In order to delete role please enter [" + name + "]");
    if(response != name) return;

    this.croleService.deleteRole(name).subscribe({
      next: response => {
        const indexToRemove = this.roles.findIndex(role => role.name === name);
        if (indexToRemove !== -1) {
          this.roles.splice(indexToRemove, 1);
        }

        const indexToRemoveBackup = this.roles_backup.findIndex(role => role.name === name);
        if(indexToRemoveBackup !== -1) {
          this.roles_backup.splice(indexToRemoveBackup, 1);
        }
      }
    });

  }

  /**
   * Reset tabele - brise se filter za pretragu po nazivu uloge
   * @param table 
   */
  clear(table: Table) {
    table.clear();
    this.roles = this.roles_backup;
  }

  /**
   * Nisam siguran za sta se ovo koristilo xD...
   * @param event 
   */
  filerApply(event: any): void {
    let tekst: string = "";
    if(event.target.value != null) {
      tekst = event.target.value;
    }

    console.log(tekst);
  }

  /**
   * Filter po nazivu koji je unet; Prikaz samo onih uloga koje sadrze taj naziv
   * @param table 
   */
  search(table: Table) {
    this.roles = this.roles_backup;
    let x = document.getElementById("search-input-term-roles-global") as HTMLInputElement;
    let searchTerm = x.value.toLowerCase();
    this.roles = this.roles.filter(x => x.name.toLowerCase().includes(searchTerm));
  }

  /**
   * Koristi se za prelazenje sa jedne stranice na drugu
   */
  next() {
    if(this.first + this.rows <= this.roles.length)
      this.first = this.first + this.rows;
  }

  /**
   * Vracanje na prethodnu stranicu
   */
  prev() {
      this.first = this.first - this.rows;
  }

  /**
   * Reset stranice na prvu stranu
   */
  reset() {
      this.first = 0;
  }

  /**
   * Promena strane
   * @param event
   */
  pageChange(event: any) {
      this.first = event.first;
      this.rows = event.rows;
  }

  /**
   * Provera da li se radi o poslednjoj stranici
   * @returns
   */
  isLastPage(): boolean {
      return this.roles ? this.first === this.roles.length - this.rows : true;
  }

  /**
   * Provera da li se radi o pocetnoj stranici
   * @returns 
   */
  isFirstPage(): boolean {
      return this.roles ? this.first === 0 : true;
  }

  /**
   * Metod za eksportovanje PDF-a koji sadrzi nazive uloga u kompaniji
   */
  exportPdf() {
    import('jspdf').then((jsPDF) => {
        import('jspdf-autotable').then((x) => {
            const doc = new jsPDF.default('p', 'px', 'a4');
            (doc as any).autoTable(this.exportColumns, this.roles);
            doc.save('roles.pdf');
        });
    });
  }

  /**
   * Metod za eksportovanje Excel fajla koji sadrzi nazive uloga u kompaniji
   */
  exportExcel() {
    import('xlsx').then((xlsx) => {
        const worksheet = xlsx.utils.json_to_sheet(this.roles);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, 'roles');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}
