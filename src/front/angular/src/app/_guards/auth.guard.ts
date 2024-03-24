import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (typeof localStorage === 'undefined') {
    return false; // localStorage is not available, return null
  }
  
  var storage = localStorage.getItem("user");
    if(!storage) return false;

  var user = JSON.parse(storage);
  if (user['token']) {
    return true;
  }
  return false;

};
