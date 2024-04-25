import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../state/project/project.service';
import { ActivatedRoute } from '@angular/router';
import {PhotoForUser} from "../../../../_models/photo-for-user";
import {UserProfilePicture} from "../../../../_service/userProfilePicture.service";
import {ProjectQuery} from "../../../state/project/project.query";
import {JUser} from "../../../../_models/user-issues";
import {UserOnProjectService} from "../../../../_service/userOnProject.service";
import {UserGetter} from "../../../../_models/user-getter";

@Component({
  selector: 'app-project-kanban-page',
  templateUrl: './project-kanban-page.component.html',
  styleUrl: './project-kanban-page.component.css'
})
export class ProjectKanbanPageComponent implements OnInit {
  projectName: string = '';
  usersPhotos: PhotoForUser[] = [];
  users: UserGetter[] = [];

  constructor(
    private _projectService: ProjectService,
    public userPictureService: UserProfilePicture,
    private userOnProject : UserOnProjectService,
    public projectQuery: ProjectQuery,
    private route: ActivatedRoute
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
  }
}
