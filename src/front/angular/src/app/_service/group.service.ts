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

    // https://localhost:5000/api/IssuesGroup?projectName=Projekat1
    createGroup(model : GroupInProject) {
        return this.http.post<void>(`${this.baseUrl}IssuesGroup`,model);
    }
    
}