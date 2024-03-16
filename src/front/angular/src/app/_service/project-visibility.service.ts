import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ProjectVisibility } from '../_models/project-visibility';

@Injectable({
  providedIn: 'root'
})
export class ProjectVisibilityService {
  
  backUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllProjectVisibilities(){
    return this.http.get<ProjectVisibility[]>(this.backUrl + "ProjectVisibilities");
  }
}
