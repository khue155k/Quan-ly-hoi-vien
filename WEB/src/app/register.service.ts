import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'https://localhost:5001/api/Company/create';

  constructor(private http: HttpClient) {}

  registerCompany(companyData: any): Observable<HttpResponse<any>> {
    return this.http.post(this.apiUrl, companyData, { observe: 'response' });
  }
}
