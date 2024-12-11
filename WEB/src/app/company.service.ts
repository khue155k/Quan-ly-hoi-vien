import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private http: HttpClient) { }

  private apiUrl = "https://localhost:5001/api/Company";

  getCompanyList(page: number, pageSize: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/company-list/?page=${page}&pageSize=${pageSize}`);
  }

  getCompanyListByStatus(status: number,page: number, pageSize: number): Observable<any> {
    if (status == 4) return this.getCompanyList(1,10);
    return this.http.get(`${this.apiUrl}/company-list-by-status/?status=${status}&page=${page}&pageSize=${pageSize}`);
  }

  getCompanyDetailById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getCompanyListByNameStatus(name: string, status: number, page: number, pageSize: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/company-list-by-name-status/?name=${name}&status=${status}&page=${page}&pageSize=${pageSize}`);
  }

  updateCompanyStatus(id: number, status: number): Observable<HttpResponse<any>> {
    return this.http.put(`${this.apiUrl}/update-status/${id}`, status, { observe: 'response' });
  }
}
