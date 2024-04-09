import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { GroupInProject } from "../_models/group-in-project";
import { EventEmitter } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class GroupService{
    baseUrl = environment.apiUrl;
    
    constructor(private http: HttpClient) { }

    getAllGroups(projectName : string){
        return this.http.get<GroupInProject[]>(`${this.baseUrl}IssuesGroup/projectName?projectName=${projectName}`);
    }
    
    createGroup(model : GroupInProject) {
        return this.http.post<void>(`${this.baseUrl}IssuesGroup`,model);
    }
    
}