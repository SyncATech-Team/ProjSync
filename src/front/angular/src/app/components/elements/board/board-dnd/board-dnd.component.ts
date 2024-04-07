import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IssueStatus, JIssue } from '../../../../_models/issue';
import { JProject } from '../../../../_models/project';
import { Observable, Subscribable, Subscription, from, map, of, tap } from 'rxjs';
import {ProjectQuery} from "../../../state/project/project.query";

@UntilDestroy()
@Component({
  selector: 'board-dnd',
  templateUrl: './board-dnd.component.html',
  styleUrl: './board-dnd.component.css'
})
export class BoardDndComponent {
  issueStatuses: IssueStatus[] = [
    IssueStatus.BACKLOG,
    IssueStatus.SELECTED,
    IssueStatus.IN_PROGRESS,
    IssueStatus.DONE
  ];

  constructor(public projectQuery: ProjectQuery) { }
}
