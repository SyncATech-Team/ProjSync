import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { arrayRemove, arrayUpsert, setLoading } from '@datorama/akita';

import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {environment} from "../../../../environments/environment";
import {JProject} from "../../../_models/project";
import {JIssue} from "../../../_models/issue";
import {JComment} from "../../../_models/comment";
import {DateUtil} from "../../utils/date-util";
import {ProjectStore} from "./project.store";


@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  baseUrl: string;

  constructor(private _http: HttpClient, private _store: ProjectStore) {
    // this.baseUrl = environment.apiUrl;
    this.baseUrl = '/assets/data';
  }

  setLoading(isLoading: boolean) {
    this._store.setLoading(isLoading);
  }

  getProject() {
    this._http
      .get<JProject>(`${this.baseUrl}/project.json`)
      .pipe(
        setLoading(this._store),
        tap((project) => {
          this._store.update((state) => ({
            ...state,
            ...project
          }));
        }),
        catchError((error) => {
          this._store.setError(error);
          return of(error);
        })
      )
      .subscribe();
  }

  updateProject(project: Partial<JProject>) {
    this._store.update((state) => ({
      ...state,
      ...project
    }));
  }

  updateIssue(issue: JIssue) {
    issue.updatedAt = DateUtil.getNow();
    this._store.update((state) => {
      const issues = arrayUpsert(state.issues, issue.id, issue);
      return {
        ...state,
        issues
      };
    });
  }

  deleteIssue(issueId: string) {
    this._store.update((state) => {
      const issues = arrayRemove(state.issues, issueId);
      return {
        ...state,
        issues
      };
    });
  }

  updateIssueComment(issueId: string, comment: JComment) {
    const allIssues = this._store.getValue().issues;
    const issue = allIssues.find((x) => x.id === issueId);
    if (!issue) {
      return;
    }

    const comments = arrayUpsert(issue.comments ?? [], comment.id, comment);
    this.updateIssue({
      ...issue,
      comments
    });
  }
}
