import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {UntilDestroy} from "@ngneat/until-destroy";
import {JIssue} from "../../../../_models/issue";
import {JUser} from "../../../../_models/user-issues";
import {ProjectService} from "../../../state/project/project.service";
import {OverlayPanel} from "primeng/overlaypanel";
import {PhotoForUser} from "../../../../_models/photo-for-user";
import {UserProfilePicture} from "../../../../_service/userProfilePicture.service";

@Component({
  selector: 'issue-assignees',
  templateUrl: './issue-assignees.component.html',
  styleUrl: './issue-assignees.component.css'
})
@UntilDestroy()
export class IssueAssigneesComponent implements OnInit, OnChanges {
  @Input() issue!: JIssue;
  @Input() users!: JUser[] | null;
  @Input() usersPhotos!: PhotoForUser[];
  assignees!: (JUser | undefined)[];

  constructor(private _projectService: ProjectService, private userPictureService: UserProfilePicture,
              private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cdr.markForCheck();
    if (this.users) {
      // @ts-ignore
      this.assignees = this.issue.userIds.map((userId) => this.users.find((x) => x.id === userId));
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const issueChange = changes['issue'];
    if (this.users && issueChange.currentValue !== issueChange.previousValue) {
      // @ts-ignore
      this.assignees = this.issue.userIds.map((userId) => this.users.find((x) => x.id === userId));
    }
  }

  removeUser(userId: string | undefined) {
    const newUserIds = this.issue.userIds.filter((x) => x !== userId);
    this._projectService.updateUsersOnIssue({
      ...this.issue,
      userIds: newUserIds
    });
  }

  addUserToIssue(user: JUser, op: OverlayPanel) {
    this._projectService.updateUsersOnIssue({
      ...this.issue,
      userIds: [...this.issue.userIds, user.id]
    });
    op.hide();
  }

  isUserSelected(user: JUser): boolean {
    return this.issue.userIds.includes(user.id);
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
}
