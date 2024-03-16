import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { ContainerLoginComponent } from './components/elements/container-login/container-login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NavBarComponent } from './components/elements/nav-bar/nav-bar.component';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { AdminPageComponent } from './components/pages/admin-page/admin-page.component';
import { RegisterUserComponent } from './components/elements/register-user/register-user.component';
import { CreateRoleComponent } from './components/elements/create-role/create-role.component';
import { AdminSidebarComponent } from './components/elements/admin-sidebar/admin-sidebar.component';
import { CreateProjectComponent } from './components/elements/create-project/create-project.component';
import { UserPageComponent } from './components/pages/admin-page/user-page/user-page.component';
import { RolePageComponent } from './components/pages/admin-page/role-page/role-page.component';
import { DashboardPageComponent } from './components/pages/admin-page/dashboard-page/dashboard-page.component';
import { PasswordResetPageComponent } from './components/pages/password-reset-page/password-reset-page.component';
import { PasswordResetComponent } from './components/elements/password-reset/password-reset.component';
import { NotificationComponent } from './components/elements/notification/notification.component';
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    ContainerLoginComponent,
    NavBarComponent,
    HomePageComponent,
    AdminPageComponent,
    RegisterUserComponent,
    CreateRoleComponent,
    AdminSidebarComponent,
    CreateProjectComponent,
    UserPageComponent,
    RolePageComponent,
    DashboardPageComponent,
    PasswordResetPageComponent,
    PasswordResetComponent,
    NotificationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    TableModule,
    TagModule,
    ButtonModule
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch())  // dodato kako bi se prevazisao warrning iz konzole
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
