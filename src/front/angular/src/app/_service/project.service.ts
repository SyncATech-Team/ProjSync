import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Project } from '../_models/project.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getAllProjects(){
    return this.http.get<Project[]>(this.baseUrl + "Projects");
  }
}
