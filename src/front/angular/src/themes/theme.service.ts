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

    updateTheme(username: string,isDark: boolean){
      if(isDark)
        var theme='lara-dark-blue';
      else
        var theme='lara-light-blue';

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
        if(themeLink.href.includes( 'lara-dark-blue.css')){
          return true;
        }
        else{
          return false;
        }
      }
      return false;
    }
}
