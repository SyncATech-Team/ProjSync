import { Component, Input, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { JUser } from '../../../../_models/user-issues';
import { JComment } from '../../../../_models/comment';
import {ProjectService} from "../../../state/project/project.service";
import {PhotoForUser} from "../../../../_models/photo-for-user";
import {UserProfilePicture} from "../../../../_service/userProfilePicture.service";
import {IssueUtil} from "../../../utils/issue-util";

@Component({
  selector: 'issue-comment',
  templateUrl: './issue-comment.component.html',
  styleUrls: ['./issue-comment.component.scss']
})
@UntilDestroy()
export class IssueCommentComponent implements OnInit {
  @Input() issueId!: string;
  @Input() comment!: JComment;
  @Input() createMode!: boolean;
  @Input() users!: JUser[] | null;
  @Input() usersPhotos!: PhotoForUser[];
  @ViewChild('commentBoxRef') commentBoxRef!: ElementRef;
  commentControl!: FormControl;
  user!: JUser;
  isEditing!: boolean;

  constructor(
    private projectService: ProjectService,
    private userPictureService: UserProfilePicture
  ) {}

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (!this.createMode || this.isEditing) {
      return;
    }
    if (event.key === 'M') {
      this.commentBoxRef.nativeElement.focus();
      this.isEditing = true;
    }
  }

  ngOnInit(): void {
    this.commentControl = new FormControl('');
    var storage = localStorage.getItem("user");
    this.user = JSON.parse(storage!);
    if (this.createMode) {
      this.comment = new JComment(this.issueId, this.user);
    }
  }

  setCommentEdit(mode: boolean) {
    this.isEditing = mode;
  }

  addComment() {
    const now = new Date();
    this.projectService.updateIssueComment({
      ...this.comment,
      id: IssueUtil.getRandomId(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      body: this.commentControl.value
    }).then( () => {
      this.commentBoxRef.nativeElement.reset();
    });
    this.cancelAddComment();
  }

  cancelAddComment() {
    this.commentControl.patchValue('');
    this.setCommentEdit(false);
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
