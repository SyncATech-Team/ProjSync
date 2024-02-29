import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Citizen } from '../models/citizen.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitizensService {

  baseApiUrl: string = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  getAllCitizens(): Observable<Citizen[]> {
    return this.http.get<Citizen[]>(this.baseApiUrl + '/api/citizens');
  }
  addCitizen(addCitizenRequest: Citizen): Observable<Citizen>{
    addCitizenRequest.umcn = '00000000-0000-0000-0000-000000000000';
    return this.http.post<Citizen>(this.baseApiUrl + '/api/citizens', addCitizenRequest);
  }
  getCitizen(umcn: string): Observable<Citizen>{
    return this.http.get<Citizen>(this.baseApiUrl + '/api/citizens/' + umcn);
  }

  updateCitizen(umcn: string, updateCitizenRequest: Citizen): Observable<Citizen>{
    return this.http.put<Citizen>(this.baseApiUrl + '/api/citizens/' + umcn, updateCitizenRequest);
  }

  deleteCitizen(umcn: string): Observable<Citizen>{
    return this.http.delete<Citizen>(this.baseApiUrl + '/api/citizens/' + umcn)
  }
}
