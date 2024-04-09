import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class GroupService{
    baseUrl = environment.apiUrl;
    constructor(private http: HttpClient) { }

    // https://localhost:5000/api/IssuesGroup?projectName=Projekat1
    createGroup(projectName: string, groupName: string) {
        return this.http.post<void>(`${this.baseUrl}IssuesGroup?projectName=${projectName}`, { projectName, groupName });
    }
}