import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { AccountService } from "../_service/account.service";
import { NotificationService } from "../_service/notification.service";
import { PresenceService } from "../_service/presence.service";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class HubConnectionInterceptor implements HttpInterceptor {

    constructor(
        private accountService: AccountService,
        private notificationService: NotificationService,
        private presenceService: PresenceService
      ) {}

      intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const user = this.accountService.getCurrentUser();
        if(user) {
            this.notificationService.createConnection(user);
            this.presenceService.createConnection(user);
        }
        return next.handle(req);
      }

}