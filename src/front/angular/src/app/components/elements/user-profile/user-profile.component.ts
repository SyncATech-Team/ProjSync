import { Component, OnInit } from '@angular/core';
import { PhotoForUser } from '../../../_models/photo-for-user';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { UserService } from '../../../_service/user.service';
import { response } from 'express';
import { UserGetter } from '../../../_models/user-getter';
import { UserProfilePicture } from '../../../_service/userProfilePicture.service';

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

  constructor(
    private _dialogConfig : DynamicDialogConfig,
    private userService: UserService,
    private userPictureService: UserProfilePicture
  ){

  }

  ngOnInit(): void {
    this.username = this._dialogConfig.data.username;
    this.firstName = this._dialogConfig.data.firstName;
    this.usersPhotos = this._dialogConfig.data.usersPhotos;
    this.users = this._dialogConfig.data.users;
    
    if(this.username)
      this.userService.getUser(this.username).subscribe({
        next: (response) => {
          this.user = response;
        },
        error: (error) => {

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
