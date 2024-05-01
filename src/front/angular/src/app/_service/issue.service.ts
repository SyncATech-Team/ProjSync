import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IssueType } from '../_models/issue-type';
import { IssuePriority } from '../_models/issue-prioritys';
import { IssueStatus } from '../_models/issue-status';
import { Observable } from 'rxjs';
import { CreateIssueModel } from '../_models/create-issue.model';
import { IssueModel } from '../_models/model-issue.model';
import { IssueDateUpdate } from '../_models/issue-date-update.model';
import { IssueDependencyUpdater } from '../_models/issue-dependency-create-delete';
import { TableLazyLoadEvent } from 'primeng/table';
import { IssueModelLazyLoad } from '../_models/model-issue-lazy-load';

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

  getPaginationAllIssuesForProject(projectName: string, event: TableLazyLoadEvent) {
    let empty: any[] = [];
    var criteriaObj = {
      first: event.first,
      rows: event.rows,
      filters: empty,
      multiSortMeta: event.multiSortMeta ? event.multiSortMeta : []
    }
    
    for(var field in event.filters){
        criteriaObj.filters.push({...{fieldfilters: event.filters[field]},field}); 
    }
    criteriaObj.filters = criteriaObj.filters.filter(item => item.fieldfilters[0].value!=null);

    var criteria = encodeURIComponent( JSON.stringify(criteriaObj));
    // console.log(criteriaObj);
   
    return this.http.get<IssueModelLazyLoad>(`${this.baseUrl}Issues/pagination/projectName?projectName=${projectName}&criteria=${criteria}`);
    
  }

  createIssue(model: CreateIssueModel){
    return this.http.post<IssueModel>(this.baseUrl + "Issues", model);
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
  
}
