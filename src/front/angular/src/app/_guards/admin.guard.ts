import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_service/account.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);

  return accountService.currentUser$.pipe(
    map(user => {

      if (!user) return false;
      if (user.roles.includes('Admin')) {
        return true;

      } else {
        return false;
      }
    })
  )
};
