import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../_service/account.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);

  const user = accountService.getCurrentUser();

  if(!user) return false;
  if(user.roles.includes("Admin")) return true;
  return inject(Router).createUrlTree(['/pageNotFound']);
};
