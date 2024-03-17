import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ProjectType } from '../_models/project-type';

@Injectable({
  providedIn: 'root'
})
export class ProjectTypeService {

  backUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllProjectTypes(){
    return this.http.get<ProjectType[]>(this.backUrl + "ProjectTypes");
  }
}
