import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Project } from '../_models/project.model';
import { TableLazyLoadEvent } from 'primeng/table';
import { ProjectLazyLoad } from '../_models/project-lazy-load';

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

  getPaginationAllProjectsForUser(username: string,event: TableLazyLoadEvent){
    var criteriaObj = {
      first: event.first,
      rows: event.rows,
      filters: event.filters,
      multiSortMeta: event.multiSortMeta ? event.multiSortMeta : []
    }
    var criteria = encodeURIComponent( JSON.stringify(criteriaObj));
    console.log(criteriaObj);
   
    return this.http.get<ProjectLazyLoad>(this.baseUrl + `Projects/pagination/user/${username}?criteria=${criteria}`);
    
    //return this.http.request<Project[]>("get",`Projects/pagination/user/${username}?criteria=`+ encodeURIComponent( JSON.stringify(event)));
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
