import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateCompanyRole } from '../_models/create-company-role';
import { environment } from '../../environments/environment';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyroleService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  create(model: CreateCompanyRole) {
    return this.http.post<CreateCompanyRole>(this.baseUrl + 'companyroles', model);
  }

  getAllCompanyRoles() {
    return this.http.get<string[]>(this.baseUrl + 'companyroles');
  }
}
