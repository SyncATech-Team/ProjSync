import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { CompanyRole } from '../../../../_models/company-role';
import { CompanyroleService } from '../../../../_service/companyrole.service';
import { Table } from 'primeng/table';
import * as FileSaver from 'file-saver';
import { Observable } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { CreateRoleComponent } from '../../../elements/create-role/create-role.component';
import { ConfirmationService } from 'primeng/api';
import { MessagePopupService } from '../../../../_service/message-popup.service';

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
  providers: [ConfirmationService]
})
export class RolePageComponent implements OnInit {
  roles$: Observable<CompanyRole[]> | undefined;
  bsModalRef: BsModalRef<CreateRoleComponent> = new BsModalRef<CreateRoleComponent>();
  @ViewChild(Table) table!:Table;
  
  //Cuva sta je uneto u search input
  searchTerm: string = '';
  
  // createdRole: CompanyRole = {
  //   name: ''
  // }

  /* PODACI CLANOVI */
  roles: CompanyRole[] = [];
  roles_backup: CompanyRole[] = [];

  cols!: Column[];
  exportColumns!: ExportColumn[];
  
  first = 0;
  rows = 10;
  loading: boolean = true;
  activityValues: number[] = [0, 100];

  initialRoleName: string = '';
  editRole: CompanyRole = {
    name: '',
    canManageProjects: false,
    canManageTasks: false,
    canLeaveComments: false,
    canUpdateTaskProgress: false,
    canUploadFiles: false
  };

  /**
   * Konstruktor
   * @param croleService 
   */
  constructor(
    private companyRoleService: CompanyroleService,
    private msgPopupSevice: MessagePopupService,
    private confirmationService: ConfirmationService,
    private msgPopupService: MessagePopupService) { }

  /**
   * OnInit
   */
  ngOnInit(): void {
    this.loading = true;
    // Dohvati sve uloge koje postoje iz baze
    this.roles$ = this.companyRoleService.getAllCompanyRoles();
    this.roles$.subscribe(roles => {
        this.roles = roles;
        this.roles_backup = roles;
    });

    // IMPROVE - Potrebno doraditi - koristi se kako bi se exportovala tabela u nekom od formata
    this.cols = [
        { field: 'name', header: 'List of company roles', customExportHeader: 'Company role name' },
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    this.loading = false;
}

  /**
   * Metod za brisanje uloge u kompaniji [potencijalno treba unaprediti error-handleing]
   * @param name 
   * @returns 
   */
  deleteCompanyRole(argRole: CompanyRole, event: Event) {

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
            this.msgPopupSevice.showSuccess("Role deleted");
            this.table.reset();
          },
          error: error => {
            this.msgPopupSevice.showError("Unable to delete choosen role. Probably in use.");
          }
        });
      },
      reject: () => {
          // this.msgPopupSevice.showError('You have rejected');
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

  }

  /**
   * Filter po nazivu koji je unet; Prikaz samo onih uloga koje sadrze taj naziv
   * @param table 
   */
  search() {
    let searchTerm = this.searchTerm.toLowerCase();
    if (searchTerm.trim() === '') {
      //Kreira se novi niz za istim elementima 
      this.roles = [...this.roles_backup];
    } else {
      this.roles = this.roles_backup.filter(role => role.name.toLowerCase().includes(searchTerm));
    }
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

  getTooltipForRole(role: CompanyRole) {
    let count: number = 0;
    let s = "List of granted permissions:";

    if(role.canManageProjects) { s += "\nAble to manage projects"; count += 1; }
    if(role.canManageTasks) { s += "\nAble to manage tasks"; count += 1; }
    if(role.canLeaveComments) { s += "\nAble to leave comments"; count += 1; }
    if(role.canUpdateTaskProgress) { s += "\nAble to update task completion percentage"; count += 1;}
    if(role.canUploadFiles) { s += "\nAble to upload files"; count += 1; }
    
    if(count === 0) s += "\nNone";

    return s;
  }

  showModalForRole(role: CompanyRole) {
    this.initialRoleName = role.name;
    let nameField = document.getElementsByClassName("roleName")[0] as HTMLInputElement;
    let canManageProjectsCheckbox = document.getElementsByClassName("canManageProjects")[0] as HTMLInputElement;
    let canManageTasksCheckbox = document.getElementsByClassName("canManageTasks")[0] as HTMLInputElement;
    let canLeaveCommentsCheckbox = document.getElementsByClassName("canLeaveComments")[0] as HTMLInputElement;
    let canUpdateTaskProgressCheckbox = document.getElementsByClassName("canUpdateTaskProgress")[0] as HTMLInputElement;
    let canUploadFilesCheckbox = document.getElementsByClassName("canUploadFiles")[0] as HTMLInputElement;

    if(nameField) { 
      nameField.value = role.name;
      this.editRole.name = role.name;
    }
    if(canManageProjectsCheckbox) { 
      canManageProjectsCheckbox.checked = role.canManageProjects;
      this.editRole.canManageProjects = role.canManageProjects;
     }
    if(canManageTasksCheckbox) { 
      canManageTasksCheckbox.checked = role.canManageTasks;
      this.editRole.canManageTasks = role.canManageTasks;
     }
    if(canLeaveCommentsCheckbox) { 
      canLeaveCommentsCheckbox.checked = role.canLeaveComments; 
      this.editRole.canLeaveComments = role.canLeaveComments;
    }
    if(canUpdateTaskProgressCheckbox) {
      canUpdateTaskProgressCheckbox.checked = role.canUpdateTaskProgress;
      this.editRole.canUpdateTaskProgress = role.canUpdateTaskProgress;
    }
    if(canUploadFilesCheckbox) {
      canUploadFilesCheckbox.checked = role.canUploadFiles;
      this.editRole.canUploadFiles = role.canUploadFiles;
    }
  }

  applyEditChanges() {
    this.companyRoleService.updateRole(this.initialRoleName, this.editRole).subscribe({
      next: () => {
        this.msgPopupService.showSuccess("Successfully edited role");
        this.ngOnInit();
      },
      error: () => {
        this.msgPopupService.showError("Unable to edit role");
      }
    });
  } 

}
