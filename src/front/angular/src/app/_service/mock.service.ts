import { Injectable } from '@angular/core';
import { JProject } from '../_models/project';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockService {

  constructor(private http: HttpClient) {}

  getProject(): Observable<JProject> {
    return this.http.get<JProject>('/assets/data/project.json');
  }
}
