import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { TasksInGroup } from '../_models/tasks-in-group';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getAllTasksInGroup(groupId: number) {
    return this.http.get<TasksInGroup[]>(`${this.baseUrl}Tasks/groupId?groupId=${groupId}`);
  }
}
