import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { UserGetter } from "../_models/user-getter";
import { Project } from "../_models/project.model";
import { UserGetterLazyLoad } from "../_models/user-getter-lazy-load";
import { TableLazyLoadEvent } from "primeng/table";

interface UserOnProjectData {
    projectName: string;
    username: string;
    userColor: string;
}
@Injectable({
    providedIn: 'root'
})

export class UserOnProjectService {
    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getAllUsersOnProject(projectName: string) {
        return this.http.get<UserGetter[]>(`${this.baseUrl}UserOnProject?projectName=${projectName}`);
    }

    getPaginationAllUsersOnProject(projectName: string,event: TableLazyLoadEvent){
        let empty: any[] = [];
        var criteriaObj = {
          first: event.first,
          rows: event.rows,
          filters: empty,
          multiSortMeta: event.multiSortMeta ? event.multiSortMeta : []
        }
        for(var field in event.filters){
            criteriaObj.filters.push({...{fieldfilters: event.filters[field]},field}); 
        }
        criteriaObj.filters = criteriaObj.filters.filter(item => item.fieldfilters[0].value!=null);
    
        var criteria = encodeURIComponent( JSON.stringify(criteriaObj));
        console.log(criteriaObj);
       
        return this.http.get<UserGetterLazyLoad>(this.baseUrl + `UserOnProject/pagination?projectName=${projectName}&criteria=${criteria}`);
        
      }

    getAllProjectsByUser(username: string){
        return this.http.get<Project[]>(`${this.baseUrl}UserOnProject/user/${username}`);
    }

    removeUserFromProject(projectName : string, username : string){
        return this.http.delete<void>(`${this.baseUrl}UserOnProject?projectName=${projectName}&username=${username}`);
    }

    addUserOnProject(projectName : string, username : string, color : string){
        //# -> %23 zbog heksadecimalnog zapisa
        color = color.replace('#', '%23');
        const body: UserOnProjectData = {
            projectName: projectName,
            username: username,
            userColor: color
        };

        return this.http.post<UserGetter>(`${this.baseUrl}UserOnProject?projectName=${projectName}&username=${username}&color=${color}`, body);
    }
}
