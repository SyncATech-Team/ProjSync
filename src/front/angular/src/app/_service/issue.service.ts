import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IssuesInGroup } from '../_models/issues-in-group';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getAllTasksInGroup(groupId: number) {
    return this.http.get<IssuesInGroup[]>(`${this.baseUrl}Tasks/groupId?groupId=${groupId}`);
  }


  getTasksTest() : Observable<JSON> {
    return this.http.get<JSON>("../../assets/testing-data/tasks.json");
  }
  
}
