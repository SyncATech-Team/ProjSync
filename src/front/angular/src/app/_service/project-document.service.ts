import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectDocumentService {

  baseUrl = environment.apiUrl;

  constructor(private http:HttpClient) { }

  uploadDocument(docFile: File){
    const formData= new FormData();
    formData.append('document', docFile, docFile.name);
    console.log(docFile);
    return this.http.post<any>(this.baseUrl + 'Documents/project/' + docFile.name, formData, {
      reportProgress: true,
      observe: 'events'
    });

  }

}
