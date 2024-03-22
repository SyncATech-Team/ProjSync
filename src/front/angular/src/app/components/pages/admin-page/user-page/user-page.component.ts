import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { UserGetter } from '../../../../_models/user-getter';
import { RegisterModel } from '../../../../_models/register-user';
import { UserService } from '../../../../_service/user.service';
import { Table } from 'primeng/table';
import * as FileSaver from 'file-saver';
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

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css',
  providers: [ConfirmationService]
})
export class UserPageComponent implements OnInit {
  
  /* PODACI CLANOVI */
  users: UserGetter[] = [];
  users_backup: UserGetter[] = [];

  searchTerm : string = '';

  cols!: Column[];
  exportColumns!: ExportColumn[];

  first = 0;
  rows = 10;
  loading: boolean = true;
  activityValues: number[] = [0, 100];
  @ViewChild(Table) table!:Table;

  constructor(private http: HttpClient, 
    private userService: UserService, 
    private msgPopupService: MessagePopupService,
    private confirmationService: ConfirmationService){ }

  ngOnInit(): void {
      this.userService.getAllUsers().subscribe({
        next: response => {
          this.users = response;
          this.users_backup = response;
        },
        error: error => {
          console.log("ERROR: " + error.error);
        }
      });

      // IMPROVE - Potrebno doraditi - koristi se kako bi se exportovala tabela u nekom od formata
      this.cols = [
        { field: 'username', header: 'Username', customExportHeader: 'Usernames' },
        { field: 'email', header: 'Email address', customExportHeader: 'Email' },
        { field: 'companyRoleName', header: 'Company position', customExportHeader: 'Position' },
      ];

      this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  onUserCreated(user: RegisterModel) {
    this.users_backup.push({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      companyRoleName: user.companyRole,
      contactPhone: user.contactPhone,
      linkedinProfile: user.linkedinProfile,
      status: user.status,
      isVerified: false,            // proveriti
      preferedLanguage: "english"   // proveriti
    });  // Add the new user to the users array
    this.users = this.users_backup;
    this.searchTerm='';
    this.table.reset();
  }

  getRandomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  getDefaultImagePath(): string {
    // let x: number = this.getRandomInteger(1, 10);
    let x: number = 1;
    let path: string = "../../../../../assets/images/DefaultAccountProfileImages/default_account_image_" + x + ".png";
    
    // console.log(path);

    return path;
  }
  
  // let ans = prompt("Are you sure that you want to delete user " + username + " [TO DO! Zahtevati da korisnik unese username kao potvrdu]");
  // if(ans != username) console.log();  

  deleteUser(username: string, event: Event): void {
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
          this.userService.deleteUser(username).subscribe({
            next: _=>{
              const indexToRemove = this.users.findIndex(user => user.username === username);
              
              //Brisanje iz lokalnog niza
              if (indexToRemove !== -1) {
                this.users.splice(indexToRemove, 1);
              }
      
              const indexToRemoveBackup = this.users_backup.findIndex(user => user.username === username);
              if(indexToRemoveBackup !== -1) {
                this.users_backup.splice(indexToRemoveBackup, 1);
              }
              this.msgPopupService.showSuccess("User deleted");
              this.table.reset();
            },
            error: error => {
              this.msgPopupService.showError("Unable to delete user");
            }
          });
        },
        reject: () => {
            this.msgPopupService.showError('You have rejected ');
        }
    });
  }

  /**
   * Reset tabele - brise se filter za pretragu po nazivu uloge
   * @param table 
   */
  clear(table: Table) {
    table.clear();
    this.users = this.users_backup;
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
  search() {
    let searchTerm = this.searchTerm.toLowerCase();
    if (searchTerm.trim() === '') {
      //Kreira se novi niz za istim elementima 
      this.users = [...this.users_backup];
    } else {
      this.users = this.users_backup.filter(user => user.username.toLowerCase().includes(searchTerm));
    }
  }

  /**
   * Koristi se za prelazenje sa jedne stranice na drugu
   */
  next() {
    if(this.first + this.rows <= this.users.length)
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
      return this.users ? this.first === this.users.length - this.rows : true;
  }

  /**
   * Provera da li se radi o pocetnoj stranici
   * @returns 
   */
  isFirstPage(): boolean {
      return this.users ? this.first === 0 : true;
  }

  /**
   * Metod za eksportovanje PDF-a koji sadrzi nazive uloga u kompaniji
   */
  exportPdf() {
    import('jspdf').then((jsPDF) => {
        import('jspdf-autotable').then((x) => {
            const doc = new jsPDF.default('p', 'px', 'a4');
            (doc as any).autoTable(this.exportColumns, this.users);
            doc.save('users.pdf');
        });
    });
  }

  /**
   * Metod za eksportovanje Excel fajla koji sadrzi nazive uloga u kompaniji
   */
  exportExcel() {
    import('xlsx').then((xlsx) => {
        const worksheet = xlsx.utils.json_to_sheet(this.users);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, 'users');
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
