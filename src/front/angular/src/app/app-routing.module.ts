import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { AdminPageComponent } from './components/pages/admin-page/admin-page.component';
import { DashboardPageComponent } from './components/pages/admin-page/dashboard-page/dashboard-page.component';
import { UserPageComponent } from './components/pages/admin-page/user-page/user-page.component';
import { RolePageComponent } from './components/pages/admin-page/role-page/role-page.component';
import { PasswordResetPageComponent } from './components/pages/password-reset-page/password-reset-page.component';

const routes: Routes = [
  {path: '', component: LoginPageComponent},
  {path: 'home', component: HomePageComponent},
  {path: 'admin', component: AdminPageComponent},
  {path: 'admin/dashboard', component: DashboardPageComponent},
  {path: 'admin/user', component: UserPageComponent},
  {path: 'admin/role', component: RolePageComponent},
  {path: 'password_reset', component: PasswordResetPageComponent},
  {path: '**', component: LoginPageComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
