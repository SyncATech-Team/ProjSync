import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DocumentTitle } from '../_models/document-title.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IssueDocumentationService {

    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    uploadDocument(issueId: number, docFiles: File[]): Observable<any> {
        const formData = new FormData();

        docFiles.forEach((file, index) => {
            formData.append('files', file);
        });

        return this.http.post(`${this.baseUrl}issue-documentation/${issueId}`, formData);
    }

    getDocumentTitles(issueId: number): Observable<DocumentTitle[]> {
        return this.http.get<DocumentTitle[]>(`${this.baseUrl}issue-documentation/get-titles/${issueId}`);
    }

    deleteDocument(documentId: number): Observable<any> {
        return this.http.delete<void>(`${this.baseUrl}issue-documentation?id=${documentId}`);
    }

    getDocumentContents(documentId: number): Observable<ArrayBuffer> {
        return this.http.get(`${this.baseUrl}issue-documentation/${documentId}/download`, { responseType: 'arraybuffer' });
    }
    
}
