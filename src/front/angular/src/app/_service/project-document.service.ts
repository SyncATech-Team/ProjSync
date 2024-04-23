import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectDocumentService {

  baseUrl = environment.apiUrl;

  constructor(private http:HttpClient) { }

  uploadDocument(projectName: string, docFiles: File[]) {
    const formData = new FormData();

    // Append each file to the FormData object
    docFiles.forEach((file, index) => {
        formData.append('files', file); // Use 'files' as the field name
    });

    // Ensure that the projectName is being sent correctly if needed
    return this.http.post<any>(this.baseUrl + 'project-documentation/' + projectName, formData);
  }

}
