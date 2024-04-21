import { Component, Input, OnChanges, OnInit, SimpleChanges, input } from '@angular/core';
import { JIssue } from '../../../../_models/issue';
import { JUser } from '../../../../_models/user-issues';
import { IssuePriorityIcon } from '../../../../_models/issue-priority-icon';
import { IssueUtil } from '../../../utils/issue-util';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { IssueModalComponent } from '../issue-modal/issue-modal.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ProjectQuery } from "../../../state/project/project.query";
import { PhotoForUser } from "../../../../_models/photo-for-user";
import { UserProfilePicture } from "../../../../_service/userProfilePicture.service";

@UntilDestroy()
@Component({
  selector: 'issue-card',
  templateUrl: './issue-card.component.html',
  styleUrl: './issue-card.component.css'
})
export class IssueCardComponent implements OnChanges, OnInit {
  @Input() issue!: JIssue;
  assignees!: (JUser | undefined)[];
  issueTypeIcon!: string;
  priorityIcon!: IssuePriorityIcon;

  usersPhotos: PhotoForUser[] = [];

  ref: DynamicDialogRef | undefined;

  constructor(private _projectQuery: ProjectQuery,  private userPictureService: UserProfilePicture, private _modalService: DialogService) { }

  ngOnInit(): void {
    this._projectQuery.users$.pipe(untilDestroyed(this)).subscribe((users) => {
      this.assignees = this.issue.userIds.map((userId) => users.find((x) => x.id === userId));
    });

    this.getUserProfilePhotos(this.assignees);
  }


  ngOnChanges(changes: SimpleChanges): void {
    const issueChange = changes['issue'];
    if (issueChange?.currentValue !== issueChange.previousValue) {
      this.issueTypeIcon = IssueUtil.getIssueTypeIcon(this.issue.type);
      this.priorityIcon = IssueUtil.getIssuePriorityIcon(this.issue.priority);
    }
  }

  openIssueModal(issueId: string) {
    this.ref = this._modalService.open(IssueModalComponent, {
      header: 'Issue - update',
      width: '65%',
      modal:true,
      breakpoints: {
          '960px': '75vw',
          '640px': '90vw'
      },
      data: {
        issue$: this._projectQuery.issueById$(issueId)
      }
    });
  }

  getUserProfilePhotos(users: (JUser | undefined)[]) {
    if (!users) return;
    for(const user of users) {
      if (!user) return;
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
    if (!this.assignees) return "";
    let index = this.assignees.findIndex(u => u!.username === username);
    if(index == -1) return this.userPictureService.getFirstDefaultImagePath();

    if(this.assignees[index]!.profilePhoto == null)
      return this.userPictureService.getDefaultImageForUser(this.assignees[index]!.username);

    let ind = this.usersPhotos.findIndex(u => u.username == username);
    if(ind == -1) return this.userPictureService.getFirstDefaultImagePath();
    console.log('[userPhotoSource]', this.usersPhotos[ind].photoSource);
    return this.usersPhotos[ind].photoSource;
  }

}
