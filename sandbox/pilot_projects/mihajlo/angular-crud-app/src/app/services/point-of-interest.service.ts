import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PointOfInterestService {
  constructor(private _http: HttpClient) {}

  addPointOfInterest(data: any): Observable<any> {
    return this._http.post('https://localhost:7294/api/pointsofinterest', data);
  }

  updatePointOfInterest(id: number, data: any): Observable<any> {
    return this._http.put(`https://localhost:7294/api/pointsofinterest/${id}`, data);
  }

  getPointOfInterestList(): Observable<any> {
    return this._http.get('https://localhost:7294/api/pointsofinterest');
  }

  deletePointOfInterest(id: number): Observable<any> {
    return this._http.delete(`https://localhost:7294/api/pointsofinterest/${id}`);
  }
}
