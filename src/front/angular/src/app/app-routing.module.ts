import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { AdminPageComponent } from './components/pages/admin-page/admin-page.component';
import { DashboardPageComponent } from './components/pages/admin-page/dashboard-page/dashboard-page.component';
import { UserPageComponent } from './components/pages/admin-page/user-page/user-page.component';
import { RolePageComponent } from './components/pages/admin-page/role-page/role-page.component';
import { PasswordResetPageComponent } from './components/pages/password-reset-page/password-reset-page.component';
import { authGuard } from './_guards/auth.guard';
import { adminGuard } from './_guards/admin.guard';
import { ConfirmEmailComponent } from './components/elements/confirm-email/confirm-email.component';
import { ProjectPageComponent } from './components/pages/project-page/project-page.component';
import { ProjectSummaryPageComponent } from './components/pages/project-page/project-summary-page/project-summary-page.component';

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: 'login', component: LoginPageComponent },
  { path: 'account/confirm-email', component: ConfirmEmailComponent },
  { path: 'account/password-reset', component: PasswordResetPageComponent },
  {
    path: '',
    runGuardsAndResolvers: 'paramsChange',
    canActivate: [authGuard],
    children: [
      { path: 'home', component: HomePageComponent },
      { path: 'home/projects', component: ProjectPageComponent },
      { path: 'home/projects/:projectName', component: ProjectPageComponent },
      { path: 'home/projects/summary/:projectName', component: ProjectSummaryPageComponent},
      { path: 'admin', component: AdminPageComponent, canActivate: [adminGuard] },
      { path: 'admin/dashboard', component: DashboardPageComponent, canActivate: [adminGuard] },
      { path: 'admin/user', component: UserPageComponent, canActivate: [adminGuard] },
      { path: 'admin/role', component: RolePageComponent, canActivate: [adminGuard] }
    ]
  },
  
  { path: '**', component: LoginPageComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
