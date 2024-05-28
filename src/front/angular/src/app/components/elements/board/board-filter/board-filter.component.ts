import {Component, Input, OnInit} from '@angular/core';
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
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'board-filter',
  templateUrl: './board-filter.component.html',
  styleUrl: './board-filter.component.css'
})
@UntilDestroy()
export class BoardFilterComponent implements OnInit {
  @Input() usersPhotos!: PhotoForUser[];
  searchControl: FormControl = new FormControl('');
  userIds: string[];
  users!: JUser[];

  MAX_NUMBER_OF_USERS_TO_SHOW: number = 5;
  showDropdown: boolean = false;

  constructor(
    public projectQuery: ProjectQuery,
    public filterQuery: FilterQuery,
    public filterService: FilterService,
    private accountService: AccountService,
    private userPictureService: UserProfilePicture,
    private translateService: TranslateService
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


  UserImagePath(username: string | undefined): string {
    if (!this.users) return "";
    let index = this.users.findIndex(u => u.username === username);
    if(index == -1) return this.userPictureService.getFirstDefaultImagePath();

    if(this.users[index].profilePhoto == null)
      return this.userPictureService.getDefaultImageForUser(this.users[index].username);

    let ind = this.usersPhotos.findIndex(u => u.username == username);
    if(ind == -1) return this.userPictureService.getFirstDefaultImagePath();
    return this.usersPhotos[ind].photoSource;
  }

  getGroupTooltip(users: any[]): string {
    let tooltip = '+' + users.length;
    this.translateService.get('general.more').subscribe((res: string) => {
      tooltip += " " + res;
    });
    return  tooltip;
  }
  
  getGroupAvatarImage(users: any[]): string {
    // This is just an example, you can use any image you like for the group avatar
    return '../../../../../assets/images/DefaultAccountProfileImages/default_account_image_2.png';
  }
  
  groupClicked(users: any[]): void {
    // Handle group click here, you can do whatever action you need
  }

}
