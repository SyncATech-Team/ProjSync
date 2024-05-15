import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IssueType } from '../_models/issue-type';
import { IssuePriority } from '../_models/issue-prioritys';
import { IssueStatus } from '../_models/issue-status';
import { Observable } from 'rxjs';
import { CreateIssueModel } from '../_models/create-issue.model';
import { IssueDateUpdate } from '../_models/issue-date-update.model';
import { IssueDependencyUpdater } from '../_models/issue-dependency-create-delete';
import { TableLazyLoadEvent } from 'primeng/table';
import { IssueModelLazyLoad } from '../_models/model-issue-lazy-load';
import { JIssue } from '../_models/issue';

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
    return this.http.get<JIssue[]>(`${this.baseUrl}Issues/groupId?groupId=${groupId}`);
  }

  getAllIssuesForProject(projectName: string) {
    return this.http.get<JIssue[]>(`${this.baseUrl}Issues/projectName?projectName=${projectName}`);
  }

  getPaginationAllIssuesForProject(projectName: string, event: TableLazyLoadEvent,search: string) {
    let empty: any[] = [];
    var criteriaObj = {
      first: event.first,
      rows: event.rows,
      filters: empty,
      multiSortMeta: event.multiSortMeta ? event.multiSortMeta : []
    }
    if(search !== "")
      criteriaObj.filters.push({fieldfilters: [{value: search, matchMode: 'contains', operator: 'and'}],field: 'name' })
    for(var field in event.filters){
        criteriaObj.filters.push({...{fieldfilters: event.filters[field]},field}); 
    }
    criteriaObj.filters = criteriaObj.filters.filter(item => item.fieldfilters[0].value!=null);

    var criteria = encodeURIComponent( JSON.stringify(criteriaObj));
    // console.log(criteriaObj);
   
    return this.http.get<IssueModelLazyLoad>(`${this.baseUrl}Issues/pagination/projectName?projectName=${projectName}&criteria=${criteria}`);
    
  }

  createIssue(model: CreateIssueModel){
    return this.http.post<JIssue>(this.baseUrl + "Issues", model);
  }

  updateIssueStartEndDate(issueId: number, model: IssueDateUpdate) {
    return this.http.put<boolean>(`${this.baseUrl}Issues/issueId?issueId=${issueId}`, model);
  }

  createOrDeleteIssueDependency(model: IssueDependencyUpdater) {
    return this.http.put<boolean>(`${this.baseUrl}Issues/`, model);
  }

  getTasksTest() : Observable<JSON> {
    return this.http.get<JSON>("../../assets/testing-data/tasks.json");
  }
  
  getUserIssues(username : string) {
    return this.http.get<JIssue[]>(`${this.baseUrl}Issues/userIssues?username=${username}`);
  }

  deleteIssue(id: string) {
    return this.http.delete<void>(`${this.baseUrl}Issues/delete-issue/${id}`);
  }
}
