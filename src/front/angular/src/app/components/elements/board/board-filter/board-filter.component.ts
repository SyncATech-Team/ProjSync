import {Component, OnInit} from '@angular/core';
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import {FormControl} from "@angular/forms";
import {ProjectQuery} from "../../../state/project/project.query";
import {FilterQuery} from "../../../state/filter/filter.query";
import {FilterService} from "../../../state/filter/filter.service";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {JUser} from "../../../../_models/user-issues";
import {AccountService} from "../../../../_service/account.service";
import {PhotoForUser} from "../../../../_models/photo-for-user";
import {UserProfilePicture} from "../../../../_service/userProfilePicture.service";

@Component({
  selector: 'board-filter',
  templateUrl: './board-filter.component.html',
  styleUrl: './board-filter.component.css'
})
@UntilDestroy()
export class BoardFilterComponent implements OnInit {
  searchControl: FormControl = new FormControl('');
  userIds: string[];
  users!: JUser[];
  usersPhotos: PhotoForUser[] = [];

  constructor(
    public projectQuery: ProjectQuery,
    public filterQuery: FilterQuery,
    public filterService: FilterService,
    private accountService: AccountService,
    private userPictureService: UserProfilePicture,
  ) {
    this.userIds = [];
  }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(100), distinctUntilChanged(), untilDestroyed(this))
      .subscribe((term) => {
        this.filterService.updateSearchTerm(term);
      });

    this.filterQuery.userIds$.pipe(untilDestroyed(this)).subscribe((userIds) => {
      this.userIds = userIds;
    });
    this.projectQuery.users$.pipe(untilDestroyed(this)).subscribe((users) => {
      this.users = users;
    })
    this.getUserProfilePhotos(this.users);
  }

  isUserSelected(user: JUser) {
    return this.userIds.includes(user.id);
  }

  ignoreResolvedChanged() {
    this.filterService.toggleIgnoreResolve();
  }

  onlyMyIssueChanged() {
    this.resetAll();
    const userId: number | undefined = this.accountService.getCurrentUser()?.id;
    this.filterService.toggleUserId(userId!.toString());
  }

  userChanged(user: JUser) {
    this.filterService.toggleUserId(user.id);
  }

  resetAll() {
    this.searchControl.setValue('');
    this.filterService.resetAll();
  }

  getUserProfilePhotos(users: JUser[] | null) {
    if (!users) return;
    for(const user of users) {
      if(user.profilePhoto != null) {
        this.userPictureService.getUserImage(user.username).subscribe({
          next: response => {
            var path = this.userPictureService.decodeBase64Image(response['fileContents']);
            var ph: PhotoForUser = {
              username: user.username,
              photoSource: path
            };
            this.usersPhotos.push(ph);
          },
          error: error => {
            console.log(error);
          }
        });
      }
      else {
        var ph: PhotoForUser = {
          username: user.username,
          photoSource: "SLIKA_JE_NULL"
        }
        this.usersPhotos.push(ph);
      }
    }
  }

  UserImagePath(username: string | undefined): string {
    if (!this.users) return "";
    let index = this.users.findIndex(u => u.username === username);
    if(index == -1) return this.userPictureService.getFirstDefaultImagePath();

    if(this.users[index].profilePhoto == null)
      return this.userPictureService.getDefaultImageForUser(this.users[index].username);

    let ind = this.usersPhotos.findIndex(u => u.username == username);
    if(ind == -1) return this.userPictureService.getFirstDefaultImagePath();
    console.log('[userPhotoSource]', this.usersPhotos[ind].photoSource);
    return this.usersPhotos[ind].photoSource;
  }
}
