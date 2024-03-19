import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountService } from '../_service/account.service';
import { Observable, take } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private accountService: AccountService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const user = this.accountService.getCurrentUser();
    if (user) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${user.token}`
        }
      })
    }

    return next.handle(req);
  }
};