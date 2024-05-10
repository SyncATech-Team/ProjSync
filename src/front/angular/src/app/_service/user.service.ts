import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserGetter } from '../_models/user-getter';
import { TableLazyLoadEvent } from 'primeng/table';
import { UserGetterLazyLoad } from '../_models/user-getter-lazy-load';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }
  
  getAllUsers() {
    return this.http.get<UserGetter[]>(this.baseUrl + "Users");
  }

  getPaginationAllUsers(visibilityFilter: boolean, event: TableLazyLoadEvent,search: string) {
    let empty: any[] = [];
    var criteriaObj = {
      first: event.first,
      rows: event.rows,
      filters: empty,
      multiSortMeta: event.multiSortMeta ? event.multiSortMeta : []
    }
    if(search !== "")
      criteriaObj.filters.push({fieldfilters: [{value: search, matchMode: 'contains', operator: 'and'}],field: 'username' });

    criteriaObj.filters.push({fieldfilters: [{value: visibilityFilter, matchMode: 'is', operator: 'and'}],field: 'isActive' })
    for(var field in event.filters){
        criteriaObj.filters.push({...{fieldfilters: event.filters[field]},field}); 
    }
    criteriaObj.filters = criteriaObj.filters.filter(item => item.fieldfilters[0].value!=null);

    var criteria = encodeURIComponent( JSON.stringify(criteriaObj));
    // console.log(criteriaObj);
   
    return this.http.get<UserGetterLazyLoad>(this.baseUrl + `Users/pagination?&criteria=${criteria}`);
    
  }

  deleteUser(username: string){
    return this.http.delete<void>(`${this.baseUrl}users/${username}`);
  }

  updateUserInfo(username: string, model: UserGetter) {
    return this.http.put<void>(`${this.baseUrl}users/${username}`, model);
  }

  getUser(username: string) {
    return this.http.get<UserGetter>(this.baseUrl + "Users/"+username);
  }
}
