import { ProjectState, ProjectStore } from './project.store';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import {IssueStatus, JIssue} from "../../../_models/issue";
import { map, delay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectQuery extends Query<ProjectState> {
  isLoading$ = this.selectLoading();
  all$ = this.select();
  issues$ = this.select('issues');
  users$ = this.select('users');
  groups$ = this.select('groups');

  constructor(protected override store: ProjectStore) {
    super(store);
  }

  lastIssuePosition = (status: IssueStatus): number => {
    const raw = this.store.getValue();
    const issuesByStatus = raw.issues.filter(x => x.status === status);
    return issuesByStatus.length;
  };

  issueByStatusSorted$ = (status: IssueStatus): Observable<JIssue[]> => this.issues$.pipe(
    map((issues) => issues
      .filter((x) => x.status === status)
      .sort((a, b) => a.listPosition - b.listPosition))
  );

  issueByGroupsSorted$ = (group_id: number): Observable<JIssue[]> => this.issues$.pipe(
    map((issues) => issues
      .filter((x) => x.groupId === group_id)
      .sort((a, b) => a.listPosition - b.listPosition))
  );

  issueById$(issueId: string){
    return this.issues$.pipe(
      delay(500),
      map((issues) => issues.find(x => x.id === issueId))
    );
  }
}
