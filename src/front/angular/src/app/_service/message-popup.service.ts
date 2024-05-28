import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class MessagePopupService {

  constructor(
    private messageService: MessageService,
    private translateService: TranslateService
) {}

    /**
     * Prikazi uspesnu poruku.
     * Poruka ce biti zelene boje.
     * @param message 
     */
    showSuccess(message: string): void {
        this.translateService.get('general.success').subscribe((res: string) => {
            this.messageService.add(
                { 
                    severity: 'success',
                    summary: res,
                    detail: message
                }
            );
        });
    }

    /**
     * Prikazi poruku greske.
     * Poruka ce biti crvene boje.
     * @param message 
     */
    showError(message: string): void {
        this.translateService.get('general.error').subscribe((res: string) => {
            this.messageService.add(
                {
                    severity: 'error',
                    summary: res,
                    detail: message
                }
            );
        });
    }

    /**
     * Prikazi obavestenje
     * @param message 
     */
    showInfo(message: string): void {
        this.translateService.get('general.info').subscribe((res: string) => {
            this.messageService.add(
                {
                    severity: 'info',
                    summary: res,
                    detail: message
                }
            );
        });
    }

}