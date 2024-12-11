import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrlNotification = "https://localhost:5001/api/Notification";

  constructor(private http: HttpClient) {

  }

  createNoti(notiData: any): Observable<HttpResponse<any>> {
    return this.http.post(`${this.apiUrlNotification}/create`, notiData, { observe: 'response' })
  }

  getNotisByNameStatus(name: string, status: number, page: number, pageSize: number): Observable<HttpResponse<any>>{
    return this.http.get(`${this.apiUrlNotification}/notificationByTitleStatus?title=${name}&status=${status}&page=${page}&pageSize=${pageSize}`, { observe: 'response' })
  }

  updateStatusNoti(id: number, status: number): Observable<HttpResponse<any>> {
    return this.http.put(`${this.apiUrlNotification}/updateStatus/${id}?status=${status}`, {}, { observe: 'response' });
  }
}
