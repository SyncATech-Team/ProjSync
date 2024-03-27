import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { UserGetter } from "../_models/user-getter";

interface UserOnProjectData {
    projectName: string;
    username: string;
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

    removeUserFromProject(projectName : string, username : string){
        return this.http.delete<void>(`${this.baseUrl}UserOnProject?projectName=${projectName}&username=${username}`);
    }

    addUserOnProject(projectName : string, username : string){
        const body: UserOnProjectData = {
            projectName: projectName,
            username: username
        };

        return this.http.post<UserGetter>(`${this.baseUrl}UserOnProject?projectName=${projectName}&username=${username}`, body);
    }
}
