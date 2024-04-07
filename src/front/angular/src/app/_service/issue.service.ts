import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IssuesInGroup } from '../_models/issues-in-group';
import { IssueGroup } from '../_models/issue-group';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getAllGroups(projectName : string){
    return this.http.get<IssueGroup[]>(`${this.baseUrl}IssueGroup/projectName?projectName=${projectName}`);
  }

  getAllTasksInGroup(groupId: number) {
    return this.http.get<IssuesInGroup[]>(`${this.baseUrl}Tasks/groupId?groupId=${groupId}`);
  }
}
