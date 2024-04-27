import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { arrayRemove, arrayUpsert, setLoading } from '@datorama/akita';

import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {JProject} from "../../../_models/project";
import {JIssue} from "../../../_models/issue";
import {JComment} from "../../../_models/comment";
import {ProjectStore} from "./project.store";
import {environment} from "../../../../environments/environment";
import {UsersWithCompletion} from "../../../_models/user-completion-level";


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

  // opsti endpoint za azuriranjem zadataka bez podrske za azuriranje user-a na zadatku
  updateIssue(issue: JIssue) {
    this._http
      .put(`${this.baseUrl}Issues/kb/${issue.id}`, issue).subscribe();

    this._store.update((state) => {
      const issues = arrayUpsert(state.issues, issue.id, issue);
      return {
        ...state,
        issues
      };
    });
  }

  // radi efikasnosti dodat je poseban endpoint na back-u koji je specijalizovan
  // za dodavanje novog user-a na issue
  updateUserOnIssue(issue: JIssue, userOnIssue: UsersWithCompletion) {
    this._http.post<number>(`${this.baseUrl}Issues/update-uoi/${issue.id}`, userOnIssue).subscribe({

      next: (newTaskCompletion: number) => {
        issue.completed = newTaskCompletion;
        this._store.update((state) => {
          const issues = arrayUpsert(state.issues, issue.id, issue);
          return {
            ...state,
            issues
          };
        });
      }
    });
  }

  // deleteUserOnIssue(issue: JIssue) {
  //   this._http
  //     .put(`${this.baseUrl}Issues/kb-uoi/${issue.id}`, issue).subscribe();
  //
  //   this._store.update((state) => {
  //     const issues = arrayUpsert(state.issues, issue.id, issue);
  //     return {
  //       ...state,
  //       issues
  //     };
  //   });
  // }

  deleteIssue(issueId: string) {
    this._store.update((state) => {
      const issues = arrayRemove(state.issues, issueId);
      return {
        ...state,
        issues
      };
    });
  }

  updateUsersOnIssueCompleteLevel(issueId: string, userOnIssue: UsersWithCompletion) {
    const allIssues = this._store.getValue().issues;
    let issue = allIssues.find((x) => x.id === issueId);
    if (!issue) {
      return;
    }

    const usersWithCompletion = arrayUpsert(issue.usersWithCompletion ?? [], userOnIssue.id, userOnIssue);
    issue = {...issue, usersWithCompletion};

    this._http.put<number>(`${this.baseUrl}Issues/update-cl/${issue.id}`, userOnIssue).subscribe({

      next: (newTaskCompletion: number) => {
        issue!.completed = newTaskCompletion;
        this._store.update((state) => {
          const issues = arrayUpsert(state.issues, issue!.id, issue!);
          return {
            ...state,
            issues
          };
        });
      }
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
