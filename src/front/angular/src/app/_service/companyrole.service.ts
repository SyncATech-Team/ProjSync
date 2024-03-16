import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, map, of } from 'rxjs';
import { CompanyRole } from '../_models/company-role';

@Injectable({
  providedIn: 'root'
})
export class CompanyroleService {
  baseUrl = environment.apiUrl;
  roles: CompanyRole[] = [];

  constructor(private http: HttpClient) { }

  public getAllCompanyRoleNames(): Observable<CompanyRole[]> {
    if (this.roles.length > 0) return of(this.roles);

    return this.http.get<CompanyRole[]>(this.baseUrl + 'Companyroles').pipe(

      map(roles => {

        this.roles = roles;
        return roles;
      })
    );
  }

  create(role: CompanyRole) {
    return this.http.post(this.baseUrl + 'Companyroles', role).pipe(

      map(()=> {
        const index = this.roles.length;
        this.roles[index] = {...this.roles[index], ...role}
      })
    )
  }

  deleteRole(name: string) {
    return this.http.delete<string>(this.baseUrl + "Companyroles/" + name);
  }
}
