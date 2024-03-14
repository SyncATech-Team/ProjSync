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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminPageComponent } from './components/pages/admin-page/admin-page.component';
import { RegisterUserComponent } from './components/elements/register-user/register-user.component';
import { CreateRoleComponent } from './components/elements/create-role/create-role.component';
import { AdminSidebarComponent } from './components/elements/admin-sidebar/admin-sidebar.component';
import { UserPageComponent } from './components/pages/admin-page/user-page/user-page.component';
import { RolePageComponent } from './components/pages/admin-page/role-page/role-page.component';
import { DashboardPageComponent } from './components/pages/admin-page/dashboard-page/dashboard-page.component';

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
    UserPageComponent,
    RolePageComponent,
    DashboardPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch())  // dodato kako bi se prevazisao warrning iz konzole
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
