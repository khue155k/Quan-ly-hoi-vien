import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

export interface JwtPayload {
  id: number;
  email: string;
  admin: string;
  name: string;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient,private router: Router) { }

  private apiUrl = "https://localhost:5001/api/Login";
  private loggedIn = false;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  login(email: string, password: string): Observable<boolean> {
    if (!this.isTokenExpired()) {
        this.loggedIn = true;
      return of(true);
    } 
    const body = { email, password };

    return this.http.post<{token: string }>(this.apiUrl, body).pipe(
      map(response => {
          this.loggedIn = true;
          localStorage.setItem("token", response.token);
          return true;
      }),
      catchError((error) => {
        console.error('Login failed', error);
        return of(false);
      })
    );
  }
  //no use
  logout(): void {
    this.loggedIn = false;
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getDecodedToken(): JwtPayload | null {
    const token = localStorage.getItem('token');
    if (token) {
      return jwtDecode<JwtPayload>(token);
    }
    return null;
  }
  
  isTokenExpired(): boolean {
    const tokenData = this.getDecodedToken();
    if (tokenData) {
      const expiryTime = tokenData.exp * 1000; 
      return Date.now() >= expiryTime; 
    }
    return true; 
  }

  changePassword(email: string, oldPassword: string, newPassword: string): Observable<boolean> {
    const body = { email, oldPassword, newPassword };

    return this.http.post<{ message: string }>(`${this.apiUrl}/change-password`, body, this.httpOptions).pipe(
      map((response) => {
        if (response.message === "Đổi mật khẩu thành công!") {
          return true;
        }
        else {
          return false;
        }
      }),
      catchError((error) => {
        console.error('Login failed', error);
        return of(false);
      })
    );
  }
}
