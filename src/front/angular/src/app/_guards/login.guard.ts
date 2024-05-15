import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../_service/account.service';

export const loginGuard : CanActivateFn  = (route, state) => {
    const router = inject(Router);

    if (typeof localStorage === 'undefined') {
        return false;
    }

    const accountService = inject(AccountService);
    const user = accountService.getCurrentUser();

    if (user) {

        router.navigate(['home']);
        return false;
    }
    return true;

}