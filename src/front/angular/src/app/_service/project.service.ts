import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Project } from '../_models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getAllProjects(){
    return this.http.get<Project[]>(this.baseUrl + "Projects");
  }

  getAllProjectsForUser(username: string){
    return this.http.get<Project[]>(this.baseUrl + `Projects/user/${username}`);
  }

  getProjectByName(projectName: string | null){
    return this.http.get<Project>(this.baseUrl + `Projects/${projectName}`);
  }

  createProject(model: Project){
    return this.http.post<Project>(this.baseUrl + "Projects", model);
  }

  updateProject(projectName: string,model: Project){
    return this.http.put<Project>(this.baseUrl + `Projects/${projectName}`,model);
  }
}
