import { Component, Injectable, OnInit } from '@angular/core';
import { AccountService } from '../../../_service/account.service';
import { Router } from '@angular/router';
import { UserService } from '../../../_service/user.service';
import { UserGetter } from '../../../_models/user-getter';
import { UserProfilePicture } from '../../../_service/userProfilePicture.service';
import { ThemeService } from '../../../../themes/theme.service';
import { PhotoForUser } from '../../../_models/photo-for-user';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { LocalService } from '../../../_service/local.service';

interface Language {

  code: string;
  name: string;
  flag: string;

}

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
@Injectable({
  providedIn: 'root'
})
export class NavBarComponent implements OnInit {

  user?: UserGetter;
  notify_collapsed : boolean = false;

  profilePicturePath: string = '';

  isDarkTheme?: boolean;
  themeColor: string = 'blue';

  languages: Language[] = [
    { code: 'en', name: 'English', flag: '../../../../assets/flags/en.png' },
    { code: 'es', name: 'Español', flag: '../../../../assets/flags/es.png'},
    { code: 'fr', name: 'Français', flag: '../../../../assets/flags/fr.png'},
    { code: 'it', name: 'Italiano', flag: '../../../../assets/flags/it.png' },
    { code: 'de', name: 'Deutsch', flag: '../../../../assets/flags/de.png'},
    { code: 'ru', name: 'Русский', flag: '../../../../assets/flags/ru.png'},
    { code: 'cn', name: '中文', flag: '../../../../assets/flags/cn.png'},
    { code: 'kr', name: '한국어', flag: '../../../../assets/flags/kr.png'},
    { code: 'rs', name: 'Srpski', flag: '../../../../assets/flags/rs.png'},
    { code: 'gr', name: 'Ελληνικά', flag: '../../../../assets/flags/gr.png'}
  ];
  selectedLanguage: Language = this.languages[0];

  appLogo: string = "../../../../assets/Icons/projsync_home_logo.png";
  

  constructor(
      private accountService: AccountService,
      private router: Router,
      private userService: UserService,
      private userPictureService: UserProfilePicture,
      private themeService: ThemeService,
      private translateService: TranslateService,
      private primengConfig: PrimeNGConfig,
      private localService: LocalService
    ) {
  }

  ngOnInit(): void {

    this.userService.getUser(this.getUsername()).subscribe({
      next: response => {
        this.user = response;
        if(this.user.profilePhoto != null) {
          this.userPictureService.getUserImage(this.user.username).subscribe({
            next: response => {
              this.profilePicturePath = response['fileContents'];
              this.profilePicturePath = this.userPictureService.decodeBase64Image(response['fileContents']);
              this.setUserPicture(this.profilePicturePath);
          },
            error: error => {
              console.log(error);
          }
          });
        }
        else {
          this.setUserPicture("SLIKA_JE_NULL");
        }
        this.themeService.switchTheme(this.user!.preferedTheme!);
        this.isDarkTheme =  this.themeService.getTheme();
        this.themeColor = this.themeService.getThemeColor();
        this.appLogo = this.themeService.getIconColor(this.isDarkTheme,this.themeColor);
        this.setLanguage(this.user!.preferedLanguage!);
      },
      error: error => {
        console.log(error.error);
      }
    });
  }
  
  logout() {
    this.accountService.logout();
    this.themeService.switchTheme('lara-light-blue');
    this.router.navigateByUrl('/');
  }

  toggleNotifyCollapsed(){
    this.notify_collapsed = !this.notify_collapsed;
  }

  getUsername() {
    if(typeof localStorage === "undefined") {
      return null;
    }
    let x = this.localService.getData('user');
    if(x == null) return "";

    return JSON.parse(x)['username'];
  }

  getFullName() {
    if(this.user == null) return "John Doe";
    return this.user.firstName + " " + this.user.lastName;
  }

  getEmail() {
    if(this.user == null) return "syncatech@hotmail.com";
    return this.user.email;
  }

  setUserPicture(src : string){
    let element = document.getElementById("profile-image");
    let image = element as HTMLImageElement;

    if(src === "SLIKA_JE_NULL") {
      if(this.user)
        image.src = this.userPictureService.getDefaultImageForUser(this.user.username);
      else
        image.src = this.userPictureService.getFirstDefaultImagePath();
    }
    else {
      image.src = src;
    }
  }

  getDefaultImage() {
    return this.userPictureService.getFirstDefaultImagePath();
  }

  setSmallerUserPicture() {
    let element = document.getElementById("small_user_image");
    if(element == null) return;
    
    let image = element as HTMLImageElement;

    let vecaSlika = document.getElementById("profile-image") as HTMLImageElement;
    image.src = vecaSlika.src;
     
  }

  navigateToDesiredTab(showUserTasks: string): void {
    this.router.navigate(['/home'], {
      queryParams: { showUserTasks }
    });
  }

  changeTheme(){
    if(this.isDarkTheme !== undefined)
    {
      this.themeService.updateTheme(this.user!.username,this.isDarkTheme,this.themeColor);
      this.appLogo=this.themeService.getIconColor(this.isDarkTheme,this.themeColor);
    }
  }

  changeLanguageHandler(event: any) {
    this.accountService.chagePreferedLanguage(this.user!.username, event.value.code).subscribe({
      next: response => {
        this.setLanguage(event.value.code);
      },
      error: error => {
        console.log(error);
      }
    });
  }

  setLanguage(langCode: string) {
    
    this.selectedLanguage = this.languages.find(x => x.code === langCode)!;

    this.translateService.use(langCode);
    this.translateService.get([
      'primengConfig.startsWith',
      'primengConfig.contains',
      'primengConfig.notContains',
      'primengConfig.endsWith',
      'primengConfig.equals',
      'primengConfig.notEquals',
      'primengConfig.noFilter',
      'primengConfig.lt',
      'primengConfig.lte',
      'primengConfig.gt',
      'primengConfig.gte',
      'primengConfig.dateIs',
      'primengConfig.dateIsNot',
      'primengConfig.dateBefore',
      'primengConfig.dateAfter',
      'primengConfig.clear',
      'primengConfig.apply',
      'primengConfig.matchAll',
      'primengConfig.matchAny',
      'primengConfig.addRule',
      'primengConfig.removeRule',
      'primengConfig.accept',
      'primengConfig.reject',
      'primengConfig.choose',
      'primengConfig.upload',
      'primengConfig.cancel',
      'primengConfig.completed',
      'primengConfig.emptyFilterMessage',
      'primengConfig.searchMessage',
      'primengConfig.selectionMessage',
      'primengConfig.emptySelectionMessage',
      'primengConfig.emptySearchMessage',
      'primengConfig.chooseYear',
      'primengConfig.chooseMonth',
      'primengConfig.chooseDate',
      'primengConfig.prevDecade',
      'primengConfig.nextDecade',
      'primengConfig.prevYear',
      'primengConfig.nextYear',
      'primengConfig.prevMonth',
      'primengConfig.nextMonth',
      'primengConfig.prevHour',
      'primengConfig.nextHour',
      'primengConfig.prevMinute',
      'primengConfig.nextMinute',
      'primengConfig.prevSecond',
      'primengConfig.nextSecond',
      'primengConfig.am',
      'primengConfig.pm',
      'primengConfig.today',
      'primengConfig.weak',
      'primengConfig.medium',
      'primengConfig.strong',
      'primengConfig.monthNames',
      'primengConfig.monthNamesShort',
      'primengConfig.dayNamesShort'
    ]).subscribe((translations) => {
      this.primengConfig.setTranslation({
        startsWith: translations['primengConfig.startsWith'],
        contains: translations['primengConfig.contains'],
        notContains: translations['primengConfig.notContains'],
        endsWith: translations['primengConfig.endsWith'],
        equals: translations['primengConfig.equals'],
        notEquals: translations['primengConfig.notEquals'],
        noFilter: translations['primengConfig.noFilter'],
        lt: translations['primengConfig.lt'],
        lte: translations['primengConfig.lte'],
        gt: translations['primengConfig.gt'],
        gte: translations['primengConfig.gte'],
        dateIs: translations['primengConfig.dateIs'],
        dateIsNot: translations['primengConfig.dateIsNot'],
        dateBefore: translations['primengConfig.dateBefore'],
        dateAfter: translations['primengConfig.dateAfter'],
        clear: translations['primengConfig.clear'],
        apply: translations['primengConfig.apply'],
        matchAll: translations['primengConfig.matchAll'],
        matchAny: translations['primengConfig.matchAny'],
        addRule: translations['primengConfig.addRule'],
        removeRule: translations['primengConfig.removeRule'],
        accept: translations['primengConfig.accept'],
        reject: translations['primengConfig.reject'],
        choose: translations['primengConfig.choose'],
        upload: translations['primengConfig.upload'],
        cancel: translations['primengConfig.cancel'],
        emptyFilterMessage: translations['primengConfig.emptyFilterMessage'],
        searchMessage: translations['primengConfig.searchMessage'],
        selectionMessage: translations['primengConfig.selectionMessage'],
        emptySelectionMessage: translations['primengConfig.emptySelectionMessage'],
        emptySearchMessage: translations['primengConfig.emptySearchMessage'],
        chooseYear: translations['primengConfig.chooseYear'],
        chooseMonth: translations['primengConfig.chooseMonth'],
        chooseDate: translations['primengConfig.chooseDate'],
        prevDecade: translations['primengConfig.prevDecade'],
        nextDecade: translations['primengConfig.nextDecade'],
        prevYear: translations['primengConfig.prevYear'],
        nextYear: translations['primengConfig.nextYear'],
        prevMonth: translations['primengConfig.prevMonth'],
        nextMonth: translations['primengConfig.nextMonth'],
        prevHour: translations['primengConfig.prevHour'],
        nextHour: translations['primengConfig.nextHour'],
        prevMinute: translations['primengConfig.prevMinute'],
        nextMinute: translations['primengConfig.nextMinute'],
        prevSecond: translations['primengConfig.prevSecond'],
        nextSecond: translations['primengConfig.nextSecond'],
        am: translations['primengConfig.am'],
        pm: translations['primengConfig.pm'],
        today: translations['primengConfig.today'],
        weak: translations['primengConfig.weak'],
        medium: translations['primengConfig.medium'],
        strong: translations['primengConfig.strong'],

        monthNames: translations['primengConfig.monthNames'],
        monthNamesShort: translations['primengConfig.monthNamesShort'],
        dayNamesMin: translations['primengConfig.dayNamesShort'],
      })
    });
  }

}
