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
import { ContentLoaderModule } from '@ngneat/content-loader';
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
import { DragDropModule } from '@angular/cdk/drag-drop';
import { IssueCardComponent } from './components/elements/issues/issue-card/issue-card.component';
import { BoardDndComponent } from './components/elements/board/board-dnd/board-dnd.component';
import { BoardDndListComponent } from './components/elements/board/board-dnd-list/board-dnd-list.component';
import { SvgDefinitionsComponent } from './components/elements/shared/svg-definitions/svg-definitions.component';
import { SvgIconComponent } from './components/elements/shared/svg-icon/svg-icon.component';
import { SamotestComponent } from './components/pages/samotest/samotest.component';
import { IssueModalComponent } from './components/elements/issues/issue-modal/issue-modal.component';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';
import { QuillModule } from 'ngx-quill';
import { NG_ENTITY_SERVICE_CONFIG } from '@datorama/akita-ng-entity-service';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { IssueDetailComponent } from './components/elements/issues/issue-detail/issue-detail.component';
import { IssueLoaderComponent } from './components/elements/issues/issue-loader/issue-loader.component';
import { IssueTypeComponent } from './components/elements/issues/issue-type/issue-type.component';
import { IssueTitleComponent } from './components/elements/issues/issue-title/issue-title.component';
import { IssueDescriptionComponent } from './components/elements/issues/issue-description/issue-description.component';
import { IssueStatusComponent } from './components/elements/issues/issue-status/issue-status.component';
import { IssuePriorityComponent } from './components/elements/issues/issue-priority/issue-priority.component';
import { IssueCommentsComponent } from './components/elements/issues/issue-comments/issue-comments.component';
import { IssueCommentComponent } from './components/elements/issues/issue-comment/issue-comment.component';
import {environment} from "../environments/environment";
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BoardFilterComponent } from './components/elements/board/board-filter/board-filter.component';
import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import { IssueReporterComponent } from './components/elements/issues/issue-reporter/issue-reporter.component';
import { ProjectGanttPageComponent } from './components/pages/project-page/project-gantt-page/project-gantt-page.component';

// GANTT CHART MODULES
import { NgxGanttModule } from '@worktile/gantt';
import { ThyLayoutModule } from 'ngx-tethys/layout';
import { ThyButtonModule } from 'ngx-tethys/button';
import { ThySwitchModule } from 'ngx-tethys/switch';
import { SpinnerComponent } from './components/elements/spinner/spinner.component';
import { LoadingInterceptor } from './_interceptors/loading.interceptor';

// END OF GANTT MODULES

import { InputSwitchModule } from 'primeng/inputswitch';
import { CreateTaskComponent } from './components/elements/create-task/create-task.component';
import { CreateGroupComponent } from './components/elements/create-group/create-group.component';
import { ProjectKanbanPageComponent } from './components/pages/project-page/project-kanban-page/project-kanban-page.component';
import { IssueAssigneesComponent } from './components/elements/issues/issue-assignees/issue-assignees.component';
import { UserProfileComponent } from './components/elements/user-profile/user-profile.component';
import { DatePipe } from '@angular/common';

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
    ProjectDocumentsPageComponent,
    CreateTaskComponent,
    CreateGroupComponent,
    ProjectGanttPageComponent,
    SpinnerComponent,
    IssueCardComponent,
    BoardDndComponent,
    BoardDndListComponent,
    SvgDefinitionsComponent,
    SvgIconComponent,
    SamotestComponent,
    IssueModalComponent,
    IssueDetailComponent,
    IssueLoaderComponent,
    IssueTypeComponent,
    IssueTitleComponent,
    IssueDescriptionComponent,
    IssueStatusComponent,
    IssuePriorityComponent,
    IssueCommentComponent,
    IssueCommentsComponent,
    IssueAssigneesComponent,
    BoardFilterComponent,
    IssueReporterComponent,
    ProjectKanbanPageComponent,
    UserProfileComponent
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
    QuillModule.forRoot(),
    ConfirmDialogModule,
    MultiSelectModule,
    CalendarModule,
    DropdownModule,
    OverlayPanelModule,
    FileUploadModule,
    ColorPickerModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    CheckboxModule,
    ConfirmPopupModule,
    NgxGanttModule,
    ThyLayoutModule,
    ThyButtonModule,
    ThySwitchModule,
    ContentLoaderModule,
    DragDropModule,
    DialogModule,
    TooltipModule,
    environment.production ? [] : AkitaNgDevtools,
    AkitaNgRouterStoreModule,
    AvatarModule,
    AvatarGroupModule,
    CdkTextareaAutosize,
    InputSwitchModule
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),  // dodato kako bi se prevazisao warrning iz konzole
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
    MessageService,
    ConfirmationService,
    DialogService,
    DatePipe,
    { provide: NG_ENTITY_SERVICE_CONFIG, useValue: { baseUrl: 'https://jsonplaceholder.typicode.com' } }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
