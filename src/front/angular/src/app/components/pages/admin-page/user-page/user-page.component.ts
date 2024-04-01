import { Component, OnInit, ViewChild } from '@angular/core';
import { UserGetter } from '../../../../_models/user-getter';
import { UserService } from '../../../../_service/user.service';
import { Table } from 'primeng/table';
import * as FileSaver from 'file-saver';
import { ConfirmationService } from 'primeng/api';
import { MessagePopupService } from '../../../../_service/message-popup.service';
import { Observable } from 'rxjs';
import { CompanyRole } from '../../../../_models/company-role';
import { CompanyroleService } from '../../../../_service/companyrole.service';
import { EmailValidationService } from '../../../../_service/email_validator.service';

/**
 * Interfejs koji predstavlja jednu kolonu u tabeli koju eksportujemo
 */
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
  
  //#region PODACI CLANOVI
  /* ******************************************* PODACI CLANOVI ******************************************* */
  /* ****************************************************************************************************** */
  private MAX_NUMBER_OF_DEFAULT_IMAGES: number = 10;
  
  users: UserGetter[] = [];
  users_backup: UserGetter[] = [];

  usersShow: any[] = [];

  roles$: Observable<CompanyRole[]> | undefined;

  initialUsername: string = '';
  editUser: UserGetter = {
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    companyRoleName: '',
    contactPhone: '',
    profilePhoto: '',
    address: '',
    status: '',
    isVerified: false,
    preferedLanguage: '',
    isActive: false,
  };

  searchTerm : string = '';

  cols!: Column[];
  exportColumns!: ExportColumn[];

  first = 0;
  rows = 10;
  loading: boolean = true;
  activityValues: number[] = [0, 100];
  @ViewChild(Table) table!:Table;

  visibilityFilter: boolean = true;

  //#endregion

  //#region METODE
  /* *********************************************** METODE *********************************************** */
  /* ****************************************************************************************************** */
  constructor(
    private userService: UserService, 
    private msgPopupService: MessagePopupService,
    private confirmationService: ConfirmationService,
    private companyRoleService: CompanyroleService,
    private emailValidationService: EmailValidationService
    ){ }

  /**
   * OnInit metod:
   * 
   * 1. Poziva se jednom, odmah nakon sto se komponenta kreira. Idealno mesto za inicijalizaciju varijabli,
   * ucitavanje podataka iz API-ja i sl.
   * 
   * 2. Poziva se kada se komponenta ponovo kreira, npr. ako je promenjena ruta
   */
  ngOnInit(): void {
      // Dovuci registrovane korisnike iz baze putem servisa
      this.userService.getAllUsers().subscribe({
        next: response => {
          this.users = response;
          this.users_backup = response;
          this.showDeactivated(false);
          // console.log(this.users);
        },
        error: error => {
          console.log("ERROR: " + error.error);
        }
      });

      // IMPROVE - Potrebno doraditi - koristi se kako bi se exportovala tabela u nekom od formata
      this.cols = [
        { field: 'username', header: 'Username', customExportHeader: 'Usernames' },
        { field: 'email', header: 'Email address', customExportHeader: 'Email' },
        { field: 'companyRoleName', header: 'Company position', customExportHeader: 'Position' }
      ];

      // Dovuci kreirane uloge u kompaniji
      this.roles$ = this.companyRoleService.getAllCompanyRoles();

      this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }
  /**
   * Poziva se kada se pomocu komponente za registraciju user-a doda novi user.
   * Omogucava azuriranje nizova users i users_backup kako bi i oni sadrzali novog usera.
   * @param user 
   */
  onUserCreated(user: UserGetter) {
    this.users_backup.push({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      companyRoleName: user.companyRoleName,
      contactPhone: user.contactPhone,
      profilePhoto: '',
      address: user.address,
      status: '',
      isVerified: false,            // proveriti !!! - hardcode
      preferedLanguage: "english",   // proveriti !!! - hardcode
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isActive : true
    });  // Add the new user to the users array
    this.users = this.users_backup;
    this.searchTerm='';
    this.table.reset();
    this.ngOnInit();  // proveriti da li moze bolje - ovako je radjeno da bi se prikazivala slika korisnika
  }
  /**
   * Funkcija koja vraca random generisani broj u opsegu min-max
   * @param min minimum
   * @param max maksimum
   * @returns generisani random broj
   */
  getRandomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  /**
   * Osnovna ideja ove funkcije je da vrati putanju predefinisanu za korisnika koji nema uploadovanu profilnu sliku.
   * Kako bi se dodatno postigla raznolikost defaultnih profilnih slika, one se mogu odrediti na osnovu korisnickog imena
   * kao ostatak pri deljenju sume svih karaktera i broja predefinisanih slika
   * @param username 
   * @returns 
   */
  getUserImagePath(username: string) {
    var index = this.users.findIndex(user => user.username === username);
    if(index == -1) return "../../../../../assets/images/DefaultAccountProfileImages/default_account_image_1.png";
    var user = this.users[index];
    let path = "";

    if(user.profilePhoto == null) {
      let usernameSumOfCharacters: number = 0;
      for (let index = 0; index < username.length; index++) {
        usernameSumOfCharacters += username.charCodeAt(index);
      }

      let defaultImageNumber = usernameSumOfCharacters % this.MAX_NUMBER_OF_DEFAULT_IMAGES + 1;
      path = "../../../../../assets/images/DefaultAccountProfileImages/default_account_image_" 
          + defaultImageNumber + ".png";
    }
    else {
      path = "../../../../../assets/images/UserProfileImages/" + user.profilePhoto;
    }
    return path;
  }
  /**
   * Metod koji brise korisnika za prosledjeno korisnicko ime
   * @param username 
   * @param event 
   */
  
  deleteUser(username: string, event: Event): void {
    
    let usrIndex = this.users.findIndex(user => user.username === username);
    let usr = this.users[usrIndex];

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: usr.isActive ? 'Do you want to deactivate this account?' : 'Do you want to activate this account?',
      header: usr.isActive ? 'Deactivate Confirmation' : 'Activate Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass:"p-button-danger p-button-text",
      rejectButtonStyleClass:"p-button-text p-button-text",
      acceptIcon:"none",
      rejectIcon:"none",

      accept: (input: string) => {
        this.userService.deleteUser(username).subscribe({
          next: _=>{
            const userIndex = this.users.findIndex(user => user.username === username);

            this.users[userIndex].isActive = !this.users[userIndex].isActive;

            this.userService.updateUserInfo(this.users[userIndex].username, this.users[userIndex]).subscribe({});

            if(this.users[userIndex].isActive == true){
              this.msgPopupService.showSuccess("User activated");
            }
            else{
              this.msgPopupService.showSuccess("User deactivated");
            }
            this.table.reset();
          },
          error: error => {
            this.msgPopupService.showError("Unable to deactive user");
          }
        });
      },
      reject: () => {
          this.msgPopupService.showError('You have rejected');
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
      this.showDeactivated(false);
    } else {
      this.usersShow = this.users_backup.filter(user => user.username.toLowerCase().includes(searchTerm));
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
  /**
   * Metod koji dinamicki popunjava podatke modala za izmenu korisnickih podataka u odnosu na to o kom
   * korisniku se radi.
   * @param user 
   */
  showModalForUser(user: UserGetter) {
    this.initialUsername = user.username;
    let firstNameField = document.getElementsByClassName("firstName")[0] as HTMLInputElement;
    let lastNameField = document.getElementsByClassName("lastName")[0] as HTMLInputElement;
    let emailAddress = document.getElementsByClassName("email")[0] as HTMLInputElement;
    let username = document.getElementsByClassName("username")[0] as HTMLInputElement;
    let rolesSelect = document.getElementsByClassName("companyRoles")[0] as HTMLSelectElement;
    let address = document.getElementsByClassName("address")[0] as HTMLInputElement;

    let img = document.getElementsByClassName("user-image")[0] as HTMLImageElement;

    if(firstNameField) { 
      firstNameField.value = user.firstName; 
      this.editUser.firstName = user.firstName;
    }
    if(lastNameField) { 
      lastNameField.value = user.lastName;
      this.editUser.lastName = user.lastName;
     }
    if(emailAddress) { 
      emailAddress.value = user.email;
      this.editUser.email = user.email;
     }
    if(username) { 
      username.value = user.username; 
      this.editUser.username = user.username;
    }
    if(rolesSelect) {
      for (let index = 0; index < rolesSelect.children.length; index++) {
        let element = rolesSelect.children[index] as HTMLOptionElement;
        if(element.textContent === user.companyRoleName) {
          element.selected = true;
          this.editUser.companyRoleName = user.companyRoleName;
          break;
        }
      }
    }
    if(address) {
      address.value = user.address;
      this.editUser.address = user.address;
    }
    if(img) {
      img.src = this.getUserImagePath(user.username);
    }
  }
  /**
   * Metod koji se poziva na klik dugmeta za promenu podataka korisnika.
   * Izvrsava provere da li su novi podaci validni i poziva servis za izmenu podataka.
   */
  applyEditChanges() {
    this.editUser.isActive = this.users.filter(user => user.username == this.initialUsername).at(0)?.isActive;  // spreciti deaktivaciju naloga kada se edituje user
    this.editUser.profilePhoto = this.users.filter(user => user.username == this.initialUsername).at(0)?.profilePhoto;
    this.userService.updateUserInfo(this.initialUsername, this.editUser).subscribe({
      next: response => {
        this.msgPopupService.showSuccess("Successfully edited user info");
        this.ngOnInit();
      },
      error: error => {
        this.msgPopupService.showError("Unable to edit user");
      }
    });
  } 
  /**
   * Metod za proveru email adrese koja se unosi u input polju za promenu korisnickog emaila.
   * Provera se vrsi na onChange zarad boljih performansi i manjeg broja proveravanja
   * @param email 
   */
  emailFormatCheck(email: string) {
    console.log("Checking: " + email);
    let isValid: boolean = this.emailValidationService.isValidEmailAddress(email);
    let mailInput: HTMLInputElement = document.getElementsByClassName("email")[0] as HTMLInputElement;
    
    mailInput.classList.remove("valid-email");
    mailInput.classList.remove("invalid-email");
    
    if(isValid) {
      mailInput.classList.add("valid-email");
    }
    else {
      mailInput.classList.add("invalid-email");
    }
  }
  getPrettierDate(date: string) {
    let d = new Date(date);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  }
  //#endregion

  // Koriste se pri filtriranju usera
  // checkbox filter || checker se koristi kako bi znali da li zelimo da menjamo stanje tabele ili ne
  showDeactivated(checker : boolean){
    if(checker){
      this.visibilityFilter = !this.visibilityFilter;
    }

    this.filterUsers(this.visibilityFilter);
  }


  // funkcija za filtriranje
  filterUsers(filter :boolean ):void {

    if(filter==true)
    {
      this.usersShow=this.users.filter((users)=> users.isActive==true);
    }
    else
    {
      this.usersShow=this.users.filter((users)=> users.isActive==false);
    }
  }

}
