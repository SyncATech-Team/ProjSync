import { Component, OnInit } from '@angular/core';
import { PhotoForUser } from '../../../_models/photo-for-user';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { UserService } from '../../../_service/user.service';
import { response } from 'express';
import { UserGetter } from '../../../_models/user-getter';
import { UserProfilePicture } from '../../../_service/userProfilePicture.service';
import { Project } from '../../../_models/project.model';
import { UserOnProjectService } from '../../../_service/userOnProject.service';
import { error } from 'console';
import { getTime } from 'date-fns';
import {PresenceService} from "../../../_service/presence.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit{
  username : string | null = '';
  firstName : string | null = '';
  usersPhotos: PhotoForUser[] = [];
  users : UserGetter[] = [];
  user : UserGetter = {
    username: "",
    email: "",
    password: '',
    firstName: "",
    lastName: "",
    companyRoleName: "",
    profilePhoto: "",
    address: "",
    contactPhone: "",
    status: "",
    isVerified: false,
    preferedLanguage: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: false
  }

  userProjects : Project[] = [];
  today: Date = new Date();

  constructor(
    private _dialogConfig : DynamicDialogConfig,
    private userService: UserService,
    private userPictureService: UserProfilePicture,
    private userOnProjectService: UserOnProjectService,
    public presenceService: PresenceService
  ){

  }

  ngOnInit(): void {
    this.username = this._dialogConfig.data.username;
    this.firstName = this._dialogConfig.data.firstName;
    this.usersPhotos = this._dialogConfig.data.usersPhotos;
    this.users = this._dialogConfig.data.users;

    const filteredUsers = this.users.filter(u => u.username === this.username);
    this.user = filteredUsers[0];
    // console.log(this.user);

    if(this.username)
    this.userOnProjectService.getAllProjectsByUser(this.username).subscribe({
      next : (response) => {
        this.userProjects = response;
      },
      error : (error) => {
        console.log(error.error);
      }
    });
  }

  getUserImage(){
    let index = this.users.findIndex(u => u.username === this.username);
    if(index == -1) return this.userPictureService.getFirstDefaultImagePath();

    if(this.users[index].profilePhoto == null)
      return this.userPictureService.getDefaultImageForUser(this.users[index].username);

    let ind = this.usersPhotos.findIndex(u => u.username == this.username);
    if(ind == -1) return this.userPictureService.getFirstDefaultImagePath();
    return this.usersPhotos[ind].photoSource;
  }
}
