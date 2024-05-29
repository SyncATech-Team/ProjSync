import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalService } from '../_service/local.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const localService = inject(LocalService);

  if (typeof localStorage === 'undefined') {
    return false; // localStorage is not available, return null
  }
  
  var storage = localService.getData('user');
    if(!storage) {
      router.navigate(['login']);
      return false;
    }

  var user = JSON.parse(storage);
  if (user['token']) {
    return true;
  }
  router.navigate(['login']);
  return false;

};
