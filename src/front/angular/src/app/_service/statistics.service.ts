import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class StatisticsService {
    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getIssueTypesInProject(projectName: string) {
        return this.http.get<{[key: string]: string}>(`${this.baseUrl}Statistics/tasktypes/${projectName}`);
    }

    getIssuePrioritiesInProject(projectName: string) {
        return this.http.get<{[key: string]: string}>(`${this.baseUrl}Statistics/taskpriorities/${projectName}`);
    }

    getIssueStatusesInProject(projectName: string) {
        return this.http.get<{[key: string]: string}>(`${this.baseUrl}Statistics/taskstatuses/${projectName}`);
    }
    
    getIssueGroupsInProject(projectName: string) {
        return this.http.get<{[key: string]: string}>(`${this.baseUrl}Statistics/taskgroups/${projectName}`);
    }

    getProjectProgress(projectName: string) {
        return this.http.get<number>(`${this.baseUrl}Statistics/projectProgress/${projectName}`);
    }

}