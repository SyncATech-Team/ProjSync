import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../_service/account.service';
import { UserOnProjectService } from '../_service/userOnProject.service';

export const ProjectGuard: CanActivateFn = async (route, state) => {
    console.log("GARDDDDD");
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
    console.log(projectName);

    try {
        await userOnProjectService.checkUserPresenceOnProject(projectName, user!.username).toPromise();
        console.log("TEST1")
        return true;
    } catch (error) {
        console.log("TEST2")
        router.navigate(['pageNotFound']);
        return false;
    }
};
