import { Component, OnInit, ViewChild } from '@angular/core';
import { UserGetter } from '../../../../_models/user-getter';
import { UserService } from '../../../../_service/user.service';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import fileSaver from 'file-saver';
import { ConfirmationService } from 'primeng/api';
import { MessagePopupService } from '../../../../_service/message-popup.service';
import { CompanyroleService } from '../../../../_service/companyrole.service';
import { EmailValidationService } from '../../../../_service/email_validator.service';
import { PhotoForUser } from '../../../../_models/photo-for-user';
import { UserProfilePicture } from '../../../../_service/userProfilePicture.service';
import { PresenceService } from '../../../../_service/presence.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ForgotPasswordModel } from '../../../../_models/forgot-password';
import { AccountService } from '../../../../_service/account.service';

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
  usersShow: UserGetter[] = [];

  roles$: any[] | undefined;

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
  searchTermChanged: Subject<string> = new Subject<string>();

  cols!: Column[];
  exportColumns!: ExportColumn[];

  first = 0;
  rows = 10;
  totalRecords = 0;
  loading: boolean = true;
  activityValues: number[] = [0, 100];
  @ViewChild(Table) table!:Table;

  visibilityFilter: boolean = false;

  usersPhotos: PhotoForUser[] = [];

  lastLazyLoadEvent!: TableLazyLoadEvent;

  //#endregion

  //#region METODE
  /* *********************************************** METODE *********************************************** */
  /* ****************************************************************************************************** */
  constructor(
    private userService: UserService, 
    private msgPopupService: MessagePopupService,
    private confirmationService: ConfirmationService,
    private companyRoleService: CompanyroleService,
    private emailValidationService: EmailValidationService,
    private userPictureService: UserProfilePicture,
    public presenceService: PresenceService,
    public accountService: AccountService
    ){
      this.searchTermChanged.pipe(debounceTime(500), distinctUntilChanged()).subscribe(_ => this.loadUsers(this.lastLazyLoadEvent));
     }

  /**
   * OnInit metod:
   * 
   * 1. Poziva se jednom, odmah nakon sto se komponenta kreira. Idealno mesto za inicijalizaciju varijabli,
   * ucitavanje podataka iz API-ja i sl.
   * 
   * 2. Poziva se kada se komponenta ponovo kreira, npr. ako je promenjena ruta
   */
  ngOnInit(): void {

      // IMPROVE - Potrebno doraditi - koristi se kako bi se exportovala tabela u nekom od formata
      this.cols = [
        { field: 'username', header: 'Username', customExportHeader: 'Usernames' },
        { field: 'email', header: 'Email address', customExportHeader: 'Email' },
        { field: 'companyRoleName', header: 'Company position', customExportHeader: 'Position' }
      ];

      // Dovuci kreirane uloge u kompaniji
      this.companyRoleService.getAllCompanyRoles().subscribe({
        next: (response) => {
          this.roles$ = response.map(role => role.name);
        },
        error: (err) => {
          console.log(err);
        }
      })

      this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }
  getUserProfilePhotos() {
    for(const user of this.users) {
      if(user.profilePhoto != null) {
        this.userPictureService.getUserImage(user.username).subscribe({
          next: response => {
            let path = response['fileContents'];
            path = this.userPictureService.decodeBase64Image(response['fileContents']);
            // this.setUserPicture(user, path);
            var ph: PhotoForUser = {
              username: user.username, 
              photoSource: path
            };
            this.usersPhotos.push(ph);
          },
          error: error => {
            console.log(error);
          }
        });
      }
      else {
        var ph: PhotoForUser = {
          username: user.username,
          photoSource: "SLIKA_JE_NULL"
        }
        this.usersPhotos.push(ph);
      }
    }
  }
  getUserImagePath(username: string) {
    let index = this.users.findIndex(u => u.username === username);
    if(index == -1) return this.userPictureService.getFirstDefaultImagePath();

    if(this.users[index].profilePhoto == null)
      return this.userPictureService.getDefaultImageForUser(this.users[index].username);

    let ind = this.usersPhotos.findIndex(u => u.username == username);
    if(ind == -1) return this.userPictureService.getFirstDefaultImagePath();
    return this.usersPhotos[ind].photoSource;
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
    this.showDeactivated(false);
    this.ngOnInit();  // proveriti da li moze bolje - ovako je radjeno da bi se prikazivala slika korisnika
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

            this.userService.updateUserInfo(this.users[userIndex].username, this.users[userIndex]).subscribe({
              next: (response) => {
                this.showDeactivated(false);
              },
              error: (err) => {
                console.log(err);
              }
            });

            if(this.users[userIndex].isActive == true){
              this.msgPopupService.showSuccess("User activated");
            }
            else{
              this.msgPopupService.showSuccess("User deactivated");
            }
            
          },
          error: error => {
            this.msgPopupService.showError("Unable to deactive user");
          }
        });
      },
      reject: () => {
          // this.msgPopupService.showError('You have rejected');
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

  }

  /**
   * Filter po nazivu koji je unet; Prikaz samo onih uloga koje sadrze taj naziv
   * @param table 
   */
  search() {
    this.searchTermChanged.next(this.searchTerm);
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
    this.userService.getAllUsers().subscribe({
      next: (response)=>{
        import('jspdf').then((jsPDF) => {
            import('jspdf-autotable').then((x) => {
                const doc = new jsPDF.default('p', 'px', 'a4');
                (doc as any).autoTable(this.exportColumns, response);
                doc.save('users.pdf');
            });
        });
      },
      error: (error)=>{
        console.log(error);
      }
    });
  }

  /**
   * Metod za eksportovanje Excel fajla koji sadrzi nazive uloga u kompaniji
   */
  exportExcel() {
    this.userService.getAllUsers().subscribe({
      next: (response)=>{
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(response);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, 'users');
        });
      },
      error: (error)=>{
        console.log(error);
      }
    });

  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    fileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
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

  resendActivationLink(user: UserGetter) {
    let model: ForgotPasswordModel = {
      email: user.email
    }
    
    this.accountService.resendLink(model).subscribe({
      next: _ => {
        this.msgPopupService.showInfo("Verification link sent");
      },
      error: error => {
        this.msgPopupService.showError(error.error);
      }
    });
  }
  /**
   * Metod koji se poziva na klik dugmeta za promenu podataka korisnika.
   * Izvrsava provere da li su novi podaci validni i poziva servis za izmenu podataka.
   */
  applyEditChanges() {
    this.editUser.isActive = this.users.filter(user => user.username == this.initialUsername).at(0)?.isActive;  // spreciti deaktivaciju naloga kada se edituje user
    this.editUser.profilePhoto = this.users.filter(user => user.username == this.initialUsername).at(0)?.profilePhoto;
    this.editUser.preferedLanguage = this.users.filter(user => user.username == this.initialUsername).at(0)!.preferedLanguage;
    this.editUser.preferedTheme = this.users.filter(user => user.username == this.initialUsername).at(0)!.preferedTheme;
    this.userService.updateUserInfo(this.initialUsername, this.editUser).subscribe({
      next: response => {
        this.msgPopupService.showSuccess("Successfully edited user info");
        this.showDeactivated(false);
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
  showDeactivated(condition: boolean){
    if(condition)
      this.visibilityFilter = !this.visibilityFilter;
    this.loadUsers(this.lastLazyLoadEvent);
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

  loadUsers(event: TableLazyLoadEvent){
    this.lastLazyLoadEvent = event;
    this.userService.getPaginationAllUsers(!this.visibilityFilter,event,this.searchTerm.toLowerCase().trim()).subscribe({
      next:(response) => {
        this.users = response.users;
        this.totalRecords = response.numberOfRecords;
        this.getUserProfilePhotos();
      },
      error: (err) => {
        console.log(err);
      }

    });
    
  }

}
