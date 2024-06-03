import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { arrayRemove, arrayUpsert, setLoading } from '@datorama/akita';

import {BehaviorSubject, of, take} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {JProject} from "../../../_models/project";
import {JIssue} from "../../../_models/issue";
import {JComment} from "../../../_models/comment";
import {ProjectStore} from "./project.store";
import {environment} from "../../../../environments/environment";
import {UsersWithCompletion} from "../../../_models/user-completion-level";
import {JCommentDto} from "../../../_models/jcomment-dto";
import {HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {User} from "../../../_models/user";
import { IssueService } from '../../../_service/issue.service';
import { MessagePopupService } from '../../../_service/message-popup.service';
import { TranslateService } from '@ngx-translate/core';
import { IssueDependencyUpdater } from '../../../_models/issue-dependency-create-delete';
import { IssueDependenciesGetter } from '../../../_models/issueDependenciesGetter.model';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  baseUrl: string;
  hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;

  private commentsSource = new BehaviorSubject<JComment[]>([]);
  comments$ = this.commentsSource.asObservable();

  constructor(
    private _http: HttpClient, 
    private _store: ProjectStore,
    private _issueService: IssueService,
    private _msgPopupService: MessagePopupService,
    private _translateService: TranslateService
  ) {
    this.baseUrl = environment.apiUrl;
  }

  createHubConnection(user: User, issueId: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'comment?issueId=' + issueId, {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch(error => console.log(error));
    this.hubConnection.on('ReceiveComments', comments => {
      this.commentsSource.next(comments);
    });

    this.hubConnection.on('CreateComment', comment => {
      const allIssues = this._store.getValue().issues;
      let issue = allIssues.find((x) => x.id === issueId);
      if (!issue) {
        return;
      }

      const comments = arrayUpsert(issue.comments ?? [], comment.id, comment);
      issue = {...issue, comments};
      this._store.update((state) => {
        const issues = arrayUpsert(state.issues, issue!.id, issue!);
        return {
          ...state,
          issues
        };
      });
    });
  }

  stopHubConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
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

  /** 
   * opsti endpoint za azuriranjem zadataka bez podrske za azuriranje user-a na zadatku  
   * @NAPOMENA Potencijalno potrebno obezbediti da ukoliko se menja a izmena nije uspesna da se vrati na stare vrednosti
   * kao sto je uradjeno sa naslovom.
   */
  updateIssue(issue: JIssue, oldTitle: string | null = null) {

    this._http
      .put(`${this.baseUrl}Issues/kb/${issue.id}`, issue).subscribe({
        next: _ => {
          this._store.update((state) => {
            const issues = arrayUpsert(state.issues, issue.id, issue);
            return {
              ...state,
              issues
            };
          });
        },
        error: error => {
          // Revert the title back to the old value if the update fails
          if(oldTitle == null) return;
          issue.title = oldTitle;
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

  deleteUserOnIssue(issue: JIssue, userId: string | undefined) {
    this._http.delete<number>(`${this.baseUrl}Issues/delete-uoi/${issue.id}/${userId}`).subscribe({

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

  addPredecessorOrSuccessor(issue: JIssue, model: IssueDependenciesGetter, modelUpdater: IssueDependencyUpdater) {

    if (model.isPredecessor) {
      const predecessors = arrayUpsert(issue.predecessors ?? [], model.id, model);
      issue = {...issue, predecessors};

    } else {
      const successors = arrayUpsert(issue.successors ?? [], model.id, model);
      issue = {...issue, successors};
    }
    

    return this._http.put<boolean>(`${this.baseUrl}Issues/`, modelUpdater).subscribe({

      next: _ => {

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

  removePredecessorOrSuccessor(issue: JIssue, model: IssueDependenciesGetter, modelUpdater: IssueDependencyUpdater) {

    if (model.isPredecessor) {
      const predecessors = arrayRemove(issue.predecessors ?? [], model.id);
      issue = {...issue, predecessors};
      
    } else {
      const successors = arrayRemove(issue.successors ?? [], model.id);
      issue = {...issue, successors};
    }

    return this._http.put<boolean>(`${this.baseUrl}Issues/`, modelUpdater).subscribe({

      next: _ => {

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


  deleteIssue(issueId: string) {
    this._issueService.deleteIssue(issueId).subscribe({
      next: () => {
        this._store.update((state) => {
          const issues = arrayRemove(state.issues, issueId);
          return {
            ...state,
            issues
          };
        });
      },
      error: error => {
        console.log(error.error);
        if(error.error.message == "Issue has a dependency") {
          this._translateService.get('create-task.task-has-a-dependency').subscribe((res: string) => {
            this._msgPopupService.showError(res);
          });
        }
      }
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

  async updateIssueComment(comment: JComment) {
    const commentDto: JCommentDto = {
      id: Number(comment.id),
      userId: comment.userId.toString(),
      body: comment.body,
      issueId: comment.issueId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt
    }

    return this.hubConnection?.invoke('CreateCommentOnIssue', commentDto)
      .catch(error => console.log(error));
  }

}
