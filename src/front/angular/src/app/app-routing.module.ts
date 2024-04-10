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
import { ProjectSummaryPageComponent } from './components/pages/project-page/project-summary-page/project-summary-page.component';
import { ProjectPeoplePageComponent } from './components/pages/project-page/project-people-page/project-people-page.component';
import { ProjectTasksPageComponent } from './components/pages/project-page/project-tasks-page/project-tasks-page.component';
import { NotFoundPageComponent } from './components/pages/not-found-page/not-found-page.component';
import { ProjectSettingsPageComponent } from './components/pages/project-page/project-settings-page/project-settings-page.component';
import { EditProfilePageComponent } from './components/pages/edit-profile-page/edit-profile-page.component';
import { HomeGuard } from './_guards/home.guard';
import { SamotestComponent } from './components/pages/samotest/samotest.component';
import { ProjectGanttPageComponent } from './components/pages/project-page/project-gantt-page/project-gantt-page.component';


const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: 'test', component: SamotestComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'account/confirm-email', component: ConfirmEmailComponent },
  { path: 'account/password-reset', component: PasswordResetPageComponent },
  {
    path: '',
    runGuardsAndResolvers: 'paramsChange',
    canActivate: [authGuard],
    children: [
      { path: 'home', component: HomePageComponent, canActivate: [HomeGuard] },
      { path: 'home/edit-profile', component: EditProfilePageComponent, canActivate: [HomeGuard] },
      { path: 'home/projects', component: ProjectTasksPageComponent, canActivate: [HomeGuard] },
      { path: 'home/projects/:projectName', component: ProjectTasksPageComponent, canActivate: [HomeGuard] },
      { path: 'home/projects/summary/:projectName', component: ProjectSummaryPageComponent, canActivate: [HomeGuard]},
      { path: 'home/projects/people/:projectName', component: ProjectPeoplePageComponent, canActivate: [HomeGuard]},
      { path: 'home/projects/tasks/:projectName', component: ProjectTasksPageComponent, canActivate: [HomeGuard] },
      { path: 'home/projects/gantt/:projectName', component: ProjectGanttPageComponent, canActivate: [HomeGuard] },
      { path: 'home/projects/settings/:projectName', component: ProjectSettingsPageComponent, canActivate: [HomeGuard] },
      { path: 'admin', component: AdminPageComponent, canActivate: [adminGuard] },
      { path: 'admin/dashboard', component: DashboardPageComponent, canActivate: [adminGuard] },
      { path: 'admin/user', component: UserPageComponent, canActivate: [adminGuard] },
      { path: 'admin/role', component: RolePageComponent, canActivate: [adminGuard] }
    ]
  },
  { path: 'pageNotFound', component: NotFoundPageComponent },
  { path: '**', redirectTo: '/pageNotFound', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
