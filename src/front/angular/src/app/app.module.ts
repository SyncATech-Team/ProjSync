import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { ContainerLoginComponent } from './components/elements/container-login/container-login.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NavBarComponent } from './components/elements/nav-bar/nav-bar.component';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { ToastModule } from 'primeng/toast';
import { ModalModule } from 'ngx-bootstrap/modal';
import { JwtInterceptor } from './_interceptors/jwt.interceptor';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmEmailComponent } from './components/elements/confirm-email/confirm-email.component';
import { ProjectSidebarComponent } from './components/elements/project-sidebar/project-sidebar.component';
import { FilterProjectComponent } from './components/elements/filter-project/filter-project.component';
import {MultiSelectModule} from 'primeng/multiselect';
import {CalendarModule} from 'primeng/calendar';
import { ProjectSummaryPageComponent } from './components/pages/project-page/project-summary-page/project-summary-page.component';
import { ProjectPeoplePageComponent } from './components/pages/project-page/project-people-page/project-people-page.component';
import { DropdownModule } from 'primeng/dropdown';
import { NotFoundPageComponent } from './components/pages/not-found-page/not-found-page.component';
import { ProjectSettingsPageComponent } from './components/pages/project-page/project-settings-page/project-settings-page.component';
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzSpinModule } from "ng-zorro-antd/spin";
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { EditProfilePageComponent } from './components/pages/edit-profile-page/edit-profile-page.component';
import { FileUploadModule } from 'primeng/fileupload';
import { ProjectTasksPageComponent } from './components/pages/project-page/project-tasks-page/project-tasks-page.component';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { ProjectDocumentsPageComponent } from './components/pages/project-page/project-documents-page/project-documents-page.component';

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
    NotificationComponent,
    ConfirmEmailComponent,
    ProjectSidebarComponent,
    FilterProjectComponent,
    ProjectSummaryPageComponent,
    ProjectPeoplePageComponent,
    NotFoundPageComponent,
    ProjectSettingsPageComponent,
    EditProfilePageComponent,
    ProjectTasksPageComponent,
    ProjectDocumentsPageComponent
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
    ButtonModule,
    ToastModule,
    ModalModule.forRoot(),
    ConfirmDialogModule,
    MultiSelectModule,
    CalendarModule,
    DropdownModule,
    NzSpinModule,
    NzIconModule.forRoot([]),
    OverlayPanelModule,
    FileUploadModule,
    ColorPickerModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    CheckboxModule,
    ConfirmPopupModule
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),  // dodato kako bi se prevazisao warrning iz konzole
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    MessageService,
    ConfirmationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
