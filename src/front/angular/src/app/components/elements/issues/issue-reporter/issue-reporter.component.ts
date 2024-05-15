import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { JIssue } from "../../../../_models/issue";
import { JUser } from "../../../../_models/user-issues";
import { ProjectService } from "../../../state/project/project.service";
import { OverlayPanel } from "primeng/overlaypanel";
import { UserProfilePicture } from "../../../../_service/userProfilePicture.service";
import { PhotoForUser } from "../../../../_models/photo-for-user";

@Component({
  selector: 'issue-reporter',
  templateUrl: './issue-reporter.component.html',
  styleUrl: './issue-reporter.component.css'
})
export class IssueReporterComponent implements OnInit, OnChanges {
  @Input() issue!: JIssue;
  @Input() users!: JUser[] | null;
  @Input() usersPhotos!: PhotoForUser[];
  reporter: JUser | undefined;

  constructor(private _projectService: ProjectService,
              private userPictureService: UserProfilePicture,
              private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cdr.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges) {
    const issueChange = changes['issue'];
    if (this.users && issueChange.currentValue !== issueChange.previousValue) {
      this.reporter = this.users.find((x) => x.id === this.issue.reporterId);
    }
  }

  isUserSelected(user: JUser) {
    return user.id === this.issue.reporterId;
  }

  updateIssue(user: JUser, op: OverlayPanel) {
    this._projectService.updateIssue({
      ...this.issue,
      reporterId: user.id
    });
    op.hide();
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
