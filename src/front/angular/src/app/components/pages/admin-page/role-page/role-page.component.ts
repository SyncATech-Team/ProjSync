import { Component, Injectable, OnInit } from '@angular/core';
import { CompanyRole } from '../../../../_models/company-role';
import { CompanyroleService } from '../../../../_service/companyrole.service';
import { Table } from 'primeng/table';
import * as FileSaver from 'file-saver';
import { Observable } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CreateRoleComponent } from '../../../elements/create-role/create-role.component';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

/**
 * Obezbediti komponentu da bude injectable
 */
@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-role-page',
  templateUrl: './role-page.component.html',
  styleUrl: './role-page.component.css',
  providers: [ConfirmationService, MessageService]
})
export class RolePageComponent implements OnInit {
  roles$: Observable<CompanyRole[]> | undefined;
  bsModalRef: BsModalRef<CreateRoleComponent> = new BsModalRef<CreateRoleComponent>();
  
  createdRole: CompanyRole = {
    name: ''
  }

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
  constructor(
    private companyRoleService: CompanyroleService,
    private messageService: MessageService,
    private modalService: BsModalService,
    private confirmationService: ConfirmationService) { }

  /**
   * OnInit
   */
  ngOnInit(): void {
    this.loading = true;
    // Dohvati sve uloge koje postoje iz baze
    this.roles$ = this.companyRoleService.getAllCompanyRoleNames();
    this.roles$.subscribe(roles => this.roles = roles);

    // IMPROVE - Potrebno doraditi - koristi se kako bi se exportovala tabela u nekom od formata
    this.cols = [
      { field: 'name', header: 'List of company roles', customExportHeader: 'Company role name' },
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    this.loading = false;
  }

  openRolesModal() {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        createdRole: this.createdRole
      }
    }
    this.bsModalRef = this.modalService.show(CreateRoleComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next: () => {
        const createdRole = this.bsModalRef.content?.createdRole;
        this.companyRoleService.create(createdRole!).subscribe({
          next: () => this.showSuccess("Successfully created new role"),
          error: _ => 
            this.showError("Unable to create new role with given parameters. Probably duplicate names")
        })
      }
    })
  }

  /**
   * Metod za brisanje uloge u kompaniji [potencijalno treba unaprediti error-handleing]
   * @param name 
   * @returns 
   */
  deleteCompanyRole(argRole: CompanyRole, event: Event) {
    // const response = prompt("In order to delete role please enter [" + argRole.name + "]");
    // if(response != argRole.name) return;

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass:"p-button-danger p-button-text",
      rejectButtonStyleClass:"p-button-text p-button-text",
      acceptIcon:"none",
      rejectIcon:"none",

      accept: (input: string) => {
        this.companyRoleService.deleteRole(argRole).subscribe({
          next: _ => {
            const indexToRemove = this.roles.findIndex(role => role.name === argRole.name);
            if (indexToRemove !== -1) {
              this.roles.splice(indexToRemove, 1);
            }
    
            const indexToRemoveBackup = this.roles_backup.findIndex(role => role.name === argRole.name);
            if(indexToRemoveBackup !== -1) {
              this.roles_backup.splice(indexToRemoveBackup, 1);
            }
            this.showSuccess("Deleted role: " + argRole.name);
          },
          error: error => {
            this.showError("Unable to delete choosen role. Probably in use.");
          }
        });
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted' });
      },
      reject: () => {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
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

  // SHOW MESSAGE POPUP
  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  showError(message: string) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

}
