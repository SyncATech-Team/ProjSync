import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class MessagePopupService {

  constructor(private messageService: MessageService) {}

    /**
     * Prikazi uspesnu poruku.
     * Poruka ce biti zelene boje.
     * @param message 
     */
    showSuccess(message: string): void {
        this.messageService.add(
            { 
                severity: 'success',
                summary: 'Success',
                detail: message
            }
        );
    }

    /**
     * Prikazi poruku greske.
     * Poruka ce biti crvene boje.
     * @param message 
     */
    showError(message: string): void {
        this.messageService.add(
            {
                severity: 'error',
                summary: 'Error',
                detail: message
            }
        );
    }

    /**
     * Prikazi obavestenje
     * @param message 
     */
    showInfo(message: string): void {
        this.messageService.add(
            {
                severity: 'info',
                summary: 'Info',
                detail: message
            }
        )
    }

}