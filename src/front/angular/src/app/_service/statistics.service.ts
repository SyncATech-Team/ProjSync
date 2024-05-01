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
}