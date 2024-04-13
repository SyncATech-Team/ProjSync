import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IssueType } from '../_models/issue-type';
import { IssuePriority } from '../_models/issue-prioritys';
import { IssueStatus } from '../_models/issue-status';
import { Observable } from 'rxjs';
import { CreateIssueModel } from '../_models/create-issue.model';
import { IssueModel } from '../_models/model-issue.model';

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
  
  getAllIssueStatus(){
    return this.http.get<IssueStatus[]>(`${this.baseUrl}IssuesStatus`);
  }

  getAllIssuesInGroup(groupId: number) {
    return this.http.get<IssueModel[]>(`${this.baseUrl}Issues/groupId?groupId=${groupId}`);
  }

  getAllIssuesForProject(projectName: string) {
    return this.http.get<IssueModel[]>(`${this.baseUrl}Issues/projectName?projectName=${projectName}`);
  }

  createIssue(model: CreateIssueModel){
    return this.http.post<IssueModel>(this.baseUrl + "Issues", model);
  }


  getTasksTest() : Observable<JSON> {
    return this.http.get<JSON>("../../assets/testing-data/tasks.json");
  }
  
}
