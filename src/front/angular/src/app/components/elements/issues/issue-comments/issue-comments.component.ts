import { Component, Input  } from '@angular/core';
import { JIssue } from '../../../../_models/issue';
import {JUser} from "../../../../_models/user-issues";
import {PhotoForUser} from "../../../../_models/photo-for-user";

@Component({
  selector: 'issue-comments',
  templateUrl: './issue-comments.component.html',
  styleUrls: ['./issue-comments.component.scss']
})
export class IssueCommentsComponent {
  @Input() issue!: JIssue;
  @Input() users!: JUser[] | null;
  @Input() usersPhotos!: PhotoForUser[];

  constructor() {}
}
