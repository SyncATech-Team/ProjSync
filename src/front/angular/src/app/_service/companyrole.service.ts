import { HttpClient } from '@angular/common/http';
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

  public getAllCompanyRoles(): Observable<CompanyRole[]> {
    // if (this.roles.length > 0) return of(this.roles); // kada se updateuje rola onda ce vratiti stare vrednosti koje su sacuvane

    return this.http.get<CompanyRole[]>(this.baseUrl + 'Companyroles').pipe(

      map(roles => {

        this.roles = roles;
        return roles;
      })
    );
  }

  getCompanyRoleByName(companyRoleName: string){
    return this.http.get<CompanyRole>(this.baseUrl + `Companyroles/${companyRoleName}`);
  }

  create(role: CompanyRole) {
    return this.http.post(this.baseUrl + 'Companyroles', role).pipe(

      map(()=> {
        const index = this.roles.length;
        this.roles[index] = {...this.roles[index], ...role}
      })
    )
  }

  deleteRole(role: CompanyRole) {
    return this.http.delete<string>(this.baseUrl + "Companyroles/" + role.name).pipe(

      map(() => {
        const index =this.roles.indexOf(role);
        this.roles.splice(index, 1);
      })
    )
  }

  updateRole(name: string, model: CompanyRole) {
    return this.http.put<void>(`${this.baseUrl}Companyroles/${name}`, model)
  }
}
