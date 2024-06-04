import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { UserService } from '../app/_service/user.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(@Inject(DOCUMENT) private document: Document,private userService: UserService) {}

    switchTheme(theme: string) {
        let themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;
        if (themeLink) {
          themeLink.href = theme + '.css';
        }
    }

    updateTheme(username: string,isDark: boolean,color: string){
      if(isDark)
        var theme='lara-dark-'+color;
      else
        var theme='lara-light-'+color;

      this.userService.updateUserPreferedTheme(username,theme).subscribe({
        next: (_)=>{
          this.switchTheme(theme);
        },
        error: (error)=>{
          console.log(error);
        }
      });
      
    }

    getTheme(){
      let themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;
      if (themeLink) {
        if(themeLink.href.includes( 'lara-dark-')){
          return true;
        }
        else{
          return false;
        }
      }
      return false;
    }

    getThemeColor(){
      let themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;
      if (themeLink) {
        return themeLink.href.split("-")[2].split(".")[0];
      }
      return 'blue';
    }
}
