import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IssuesInGroup } from '../_models/issues-in-group';
import { IssueGroup } from '../_models/issue-group';
import { IssueType } from '../_models/issue-type';
import { IssuePriority } from '../_models/issue-prioritys';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getAllGroups(projectName : string){
    return this.http.get<IssueGroup[]>(`${this.baseUrl}IssueGroup/projectName?projectName=${projectName}`);
  }

  getAllIssueTypes(){
    return this.http.get<IssueType[]>(`${this.baseUrl}IssueType`);
  }

  getAllIssuePrioritys(){
    return this.http.get<IssuePriority[]>(`${this.baseUrl}IssuesPriority`);
  }

  getAllTasksInGroup(groupId: number) {
    return this.http.get<IssuesInGroup[]>(`${this.baseUrl}Tasks/groupId?groupId=${groupId}`);
  }
}
