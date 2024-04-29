import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { JIssue } from '../../../../_models/issue';
import {JUser} from "../../../../_models/user-issues";
import {PhotoForUser} from "../../../../_models/photo-for-user";
import {ProjectService} from "../../../state/project/project.service";
import {AccountService} from "../../../../_service/account.service";
import {User} from "../../../../_models/user";


@Component({
  selector: 'issue-comments',
  templateUrl: './issue-comments.component.html',
  styleUrls: ['./issue-comments.component.scss']
})
export class IssueCommentsComponent implements OnInit, OnDestroy {
  @Input() issue!: JIssue;
  @Input() users!: JUser[] | null;
  @Input() usersPhotos!: PhotoForUser[];
  user!: User;

  constructor(public projectService: ProjectService, private accountService: AccountService) {
  }

  ngOnInit(): void {
    this.user = this.accountService.getCurrentUser()!;
    this.projectService.createHubConnection(this.user, this.issue.id);
  }


  ngOnDestroy(): void {
    this.projectService.stopHubConnection();
  }
}
