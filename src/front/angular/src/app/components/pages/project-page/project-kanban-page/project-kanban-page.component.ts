import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../state/project/project.service';
import { ActivatedRoute } from '@angular/router';
import {PhotoForUser} from "../../../../_models/photo-for-user";
import {UserProfilePicture} from "../../../../_service/userProfilePicture.service";
import {ProjectQuery} from "../../../state/project/project.query";
import {UserOnProjectService} from "../../../../_service/userOnProject.service";
import {UserGetter} from "../../../../_models/user-getter";
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateTaskComponent } from '../../../elements/create-task/create-task.component';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from '../../../../_service/account.service';

@Component({
  selector: 'app-project-kanban-page',
  templateUrl: './project-kanban-page.component.html',
  styleUrl: './project-kanban-page.component.css'
})
export class ProjectKanbanPageComponent implements OnInit {
  projectName: string = '';
  usersPhotos: PhotoForUser[] = [];
  users: UserGetter[] = [];

  canManageTask: string = '';

  ref: DynamicDialogRef | undefined;

  constructor(
    private _projectService: ProjectService,
    public userPictureService: UserProfilePicture,
    private userOnProject : UserOnProjectService,
    public projectQuery: ProjectQuery,
    private route: ActivatedRoute,
    private _modalService: DialogService,
    private translateService: TranslateService,
    private accountService: AccountService
  ){
  }

  ngOnInit(): void {
    this.projectName = this.route.snapshot.paramMap.get('projectName')!;
    this._projectService.getProject(this.projectName);

    this.userOnProject.getAllUsersOnProject(this.projectName).subscribe({
      next: (response) => {
        this.users = response.filter(user => user.username !== 'admin');
        this.usersPhotos = this.userPictureService.getUserProfilePhotos(this.users);
      },
      error: (error) => {
        console.log(error);
      }
    });

    var user = this.accountService.getCurrentUser();
    
    if(user?.permitions) {

      this.canManageTask = user.permitions.canManageTasks;
    }
  }

  showCreateTaskPopupTaskKanban() {
    this.translateService.get('kanban-page.create-task').subscribe((res: string) => {
    
      this.ref = this._modalService.open(CreateTaskComponent, {
        header: res,
          width: '50%',
          contentStyle: { overflow: 'auto' },
          baseZIndex: 10000,
          maximizable: true,
          closable: true,
          modal: true,
          dismissableMask: true,
          closeOnEscape: true,
          data: {
            projectName: this.projectName
          }
      });
  
      this.ref.onClose.subscribe((data: any) => {
        if(data !== "created-task") return;         // NE REFRESHUJ STRANICU AKO NIJE DODAT ZADATAK
  

        this.ngOnInit();
      });

    });

  }

}
