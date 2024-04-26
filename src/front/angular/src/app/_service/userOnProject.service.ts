import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { UserGetter } from "../_models/user-getter";
import { Project } from "../_models/project.model";

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

    getAllProjectsByUser(username: string){
        return this.http.get<Project[]>(`${this.baseUrl}UserOnProject/user/${username}`);
    }

    removeUserFromProject(projectName : string, username : string){
        return this.http.delete<void>(`${this.baseUrl}UserOnProject?projectName=${projectName}&username=${username}`);
    }

    checkUserPresenceOnProject(projectName : string, username: string){
        return this.http.get<string>(`${this.baseUrl}UserOnProject/check?projectname=${projectName}&username=${username}`);
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
