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

const routes: Routes = [
  {path: '', component: LoginPageComponent},
  {path: '',
    runGuardsAndResolvers: 'pathParamsChange',
    canActivate: [authGuard],
    children: [
      {path: 'home', component: HomePageComponent},
      {path: 'password_reset', component: PasswordResetPageComponent},
      {path: 'admin', component: AdminPageComponent, canActivate: [adminGuard]},
      {path: 'admin/dashboard', component: DashboardPageComponent, canActivate: [adminGuard]},
      {path: 'admin/user', component: UserPageComponent, canActivate: [adminGuard]},
      {path: 'admin/role', component: RolePageComponent, canActivate: [adminGuard]}
    ]
  },
  {path: '**', component: LoginPageComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
