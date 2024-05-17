import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(@Inject(DOCUMENT) private document: Document) {}

    switchTheme(isDark: boolean) {
        let themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;

        if (themeLink) {
          if(isDark){
            themeLink.href = 'lara-dark-blue.css';
          }
          else{
            themeLink.href = 'lara-light-blue.css';
          }
        }
    }

    getTheme(){
      let themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;
      console.log(themeLink.href)
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
