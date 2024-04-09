import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IssuesInGroup } from '../_models/issues-in-group';
import { IssueType } from '../_models/issue-type';
import { IssuePriority } from '../_models/issue-prioritys';
import { IssueStatus } from '../_models/issue-status';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getAllIssueTypes(){
    return this.http.get<IssueType[]>(`${this.baseUrl}IssueType`);
  }

  getAllIssuePrioritys(){
    return this.http.get<IssuePriority[]>(`${this.baseUrl}IssuesPriority`);
  }

  getAllTasksInGroup(groupId: number) {
    return this.http.get<IssuesInGroup[]>(`${this.baseUrl}Tasks/groupId?groupId=${groupId}`);
  }

  getAllIssueStatus(){
    return this.http.get<IssueStatus[]>(`${this.baseUrl}IssuesStatus`);
  }

  createIssue(model: IssuesInGroup){
    return this.http.post<IssuesInGroup>(this.baseUrl + "Issues", model);
  }
}
