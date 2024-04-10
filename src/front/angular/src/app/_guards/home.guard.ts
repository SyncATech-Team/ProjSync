import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../_service/account.service';

export const HomeGuard: CanActivateFn = (route, state) => {
    const accountService = inject(AccountService);

    const user = accountService.getCurrentUser();

    if(!user) return false;
    if(user.roles.includes("Admin") == false) return true;
    return inject(Router).createUrlTree(['/pageNotFound']);
}
