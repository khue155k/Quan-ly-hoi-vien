import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembershipFeeService {
  constructor(private http: HttpClient) { }

  private apiUrlFee = "https://localhost:5001/api/Fee";
  private apiUrlMembershipFee = "https://localhost:5001/api/MembershipFee";

  getFeeList(): Observable<any> {
    return this.http.get(`${this.apiUrlFee}`);
  }

  addFee(feeData: any): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrlFee}/create`, feeData, {headers})
  }

  getMembershipFeeListByNameYear(name: string, year: number, page: number, pageSize: number): Observable<any>{
    return this.http.get(`${this.apiUrlMembershipFee}/company-list-by-name-year?name=${name}&year=${year}&page=${page}&pageSize=${pageSize}`);
  }

  getMembershipFeeListByNameYearNotPay(name: string, year: number, page: number, pageSize: number): Observable<any>{
    return this.http.get(`${this.apiUrlMembershipFee}/company-list-by-name-year-notpay?name=${name}&year=${year}&page=${page}&pageSize=${pageSize}`);
  }

  getPaidCompanyCount(year :number): Observable<any>{
    return this.http.get(`${this.apiUrlMembershipFee}/paid-count?year=${year}`)
  }

  payMembershipFee(data: any): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.apiUrlMembershipFee}/pay`, data, {headers})
  }
}
