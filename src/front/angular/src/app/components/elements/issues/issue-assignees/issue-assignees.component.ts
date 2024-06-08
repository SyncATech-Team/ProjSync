import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {UntilDestroy} from "@ngneat/until-destroy";
import {JIssue} from "../../../../_models/issue";
import {JUser} from "../../../../_models/user-issues";
import {ProjectService} from "../../../state/project/project.service";
import {OverlayPanel} from "primeng/overlaypanel";
import {PhotoForUser} from "../../../../_models/photo-for-user";
import {UserProfilePicture} from "../../../../_service/userProfilePicture.service";
import {UsersWithCompletion} from "../../../../_models/user-completion-level";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {IssueChangeProgressComponent} from "../issue-change-progress/issue-change-progress.component";
import {PresenceService} from "../../../../_service/presence.service";
import { AccountService } from '../../../../_service/account.service';
import { TranslateService } from '@ngx-translate/core';

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
  @Input() canManageTask!: string;
  
  assignees!: (JUser | undefined)[];
  valueList!: UsersWithCompletion[];

  ref: DynamicDialogRef | undefined;
  permitions: any;

  constructor(private _projectService: ProjectService,
              private userPictureService: UserProfilePicture,
              private cdr: ChangeDetectorRef,
              public dialogService: DialogService,
              public presenceService: PresenceService,
              private accoutService: AccountService,
              private translationService: TranslateService
  ) {}

  ngOnInit(): void {
    this.cdr.markForCheck();
    if (this.users) {
      // @ts-ignore
      this.assignees = this.issue.userIds.map((userId) => this.users.find((x) => x.id === userId));
      this.valueList = this.issue.usersWithCompletion;
    }
    var user = this.accoutService.getCurrentUser();
    if(user?.permitions)
      this.permitions = user.permitions;
  }

  ngOnChanges(changes: SimpleChanges) {
    const issueChange = changes['issue'];
    if (this.users && issueChange.currentValue !== issueChange.previousValue) {
      // @ts-ignore
      this.assignees = this.issue.userIds.map((userId) => this.users.find((x) => x.id === userId));
      this.valueList = this.issue.usersWithCompletion;
    }
  }

  removeUser(userId: string | undefined) {
    const newUserIds = this.issue.userIds.filter((x) => x !== userId);
    const newCLIds = this.issue.usersWithCompletion.filter((x) => x.id !== userId);
    this._projectService.deleteUserOnIssue({
      ...this.issue,
      userIds: newUserIds,
      usersWithCompletion: newCLIds
    }, userId);
  }

  show(userId: string | undefined, userName: string | undefined, completionLevel: number) {
    this.translationService.get('issue-change-progress.change-progress').subscribe((res: string) => {
      this.ref = this.dialogService.open(IssueChangeProgressComponent, {
        data: {
          issueId: this.issue.id,
          userId: userId,
          userName: userName,
          currentCompletionLevel: completionLevel
        },
        header: res
      });
    });
  }

  addUserToIssue(user: JUser, op: OverlayPanel) {

    let userOnIssue: UsersWithCompletion = {
      id: user.id,
      userId: user.id,
      completionLevel: 0.0
    }
    this._projectService.updateUserOnIssue({
      ...this.issue,
      userIds: [...this.issue.userIds, user.id],
      usersWithCompletion: [...this.issue.usersWithCompletion, userOnIssue]
    }, userOnIssue);
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
