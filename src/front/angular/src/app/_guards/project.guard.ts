import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../_service/account.service';
import { UserOnProjectService } from '../_service/userOnProject.service';

export const ProjectGuard: CanActivateFn = async (route, state) => {
    const router = inject(Router);

    if (typeof localStorage === 'undefined') {
        return false;
    }

    const accountService = inject(AccountService);
    const userOnProjectService = inject(UserOnProjectService);

    const user = accountService.getCurrentUser();
    const projectName = route.params['projectName'];
    if (projectName == undefined) {
        router.navigate(['pageNotFound']);
        return false;
    }

    try {
        await userOnProjectService.checkUserPresenceOnProject(projectName, user!.username).toPromise();
        return true;
    } catch (error) {
        router.navigate(['pageNotFound']);
        return false;
    }
};
