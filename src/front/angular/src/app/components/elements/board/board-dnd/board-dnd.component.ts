import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IssueStatus, JIssue } from '../../../../_models/issue';
import { JProject } from '../../../../_models/project';
import { MockService } from '../../../../_service/mock.service';
import { Observable, Subscribable, Subscription, from, map, of, tap } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'board-dnd',
  templateUrl: './board-dnd.component.html',
  styleUrl: './board-dnd.component.css'
})
export class BoardDndComponent implements OnInit {
  issueStatuses: IssueStatus[] = [
    IssueStatus.BACKLOG,
    IssueStatus.SELECTED,
    IssueStatus.IN_PROGRESS,
    IssueStatus.DONE
  ];

  project!: JProject;
  issues$!: Observable<JIssue[]>

  constructor(private _api: MockService) { }
  
  ngOnInit(): void {
    this.getProject();
  }

  getProject() {
    this._api.getProject().pipe(untilDestroyed(this))
      .subscribe((project: JProject) => {
        this.project = project;
        this.issues$ = of(this.project.issues);
      });
  }

  issueByStatusSorted$ = (status: IssueStatus): Observable<JIssue[]> => this.issues$.pipe(
    map((issues) => issues
      .filter((x) => x.status === status)
      .sort((a, b) => a.listPosition - b.listPosition))
  );
  
}
