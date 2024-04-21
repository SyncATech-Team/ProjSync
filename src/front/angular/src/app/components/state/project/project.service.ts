import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { arrayRemove, arrayUpsert, setLoading } from '@datorama/akita';

import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {JProject} from "../../../_models/project";
import {JIssue} from "../../../_models/issue";
import {JComment} from "../../../_models/comment";
import {DateUtil} from "../../utils/date-util";
import {ProjectStore} from "./project.store";
import {environment} from "../../../../environments/environment";
import {is} from "date-fns/locale";


@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  baseUrl: string;

  constructor(private _http: HttpClient, private _store: ProjectStore) {
    this.baseUrl = environment.apiUrl;
    // this.baseUrl = '/assets/data';
  }

  getProject(projectName: string) {
    this._http
      .get<JProject>(`${this.baseUrl}Projects/${projectName}/all`)
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

  updateIssue(issue: JIssue) {
    this._store.update((state) => {
      const issues = arrayUpsert(state.issues, issue.id, issue);
      return {
        ...state,
        issues
      };
    });

    this._http
      .put(`${this.baseUrl}Issues/kb/${issue.id}`, issue).subscribe();
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
