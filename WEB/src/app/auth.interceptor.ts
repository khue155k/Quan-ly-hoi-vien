// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { AuthService } from './auth.service';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const authService = inject(AuthService);
//   const token = authService.getToken(); 
//   console.log(token);
//   if (token) {
//     const clonedReq = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}` 
//       }
//     });
//     return next(clonedReq); 
//   }
//   return next(req);
// };
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable,catchError,throwError  } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authService = inject(AuthService);
    const token = authService.getToken(); 
    console.log("abc");
    let clonedRequest = req;

    if (token) {
      clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          authService.logout();
        }
        return throwError(() => error);
      })
    );
  }
}


// import {inject, Injectable} from '@angular/core';
// import {
//   HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpXsrfTokenExtractor
// } from '@angular/common/http';

// import { Observable, switchMap } from 'rxjs';
// import { AuthService } from './auth.service';
// import { SsrCookieService } from 'ngx-cookie-service-ssr';

// @Injectable()
// export class HttpXsrfInterceptor implements HttpInterceptor {
//   headerName = 'X-XSRF-TOKEN';

//   constructor(private tokenService: HttpXsrfTokenExtractor) {}

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     console.log('HttpXsrfInterceptor worked!', req.url)
//     if (req.method === 'GET'  req.method === 'HEAD') {
//       return next.handle(req);
//     }

//     const authService = inject(AuthService);
//     return authService.getCsrfToken().pipe(
//       switchMap(()=>{
//         const token = this.tokenService.getToken();

//         // Be careful not to overwrite an existing header of the same name.
//         if (token !== null && !req.headers.has(this.headerName)) {
//           req = req.clone({headers: req.headers.set(this.headerName, token)});
//         }
//         return next.handle(req);
//         })
//     )
//   }
// }

// @Injectable()
// export class ApplyTokenInterceptor implements HttpInterceptor {
  
//   constructor(private ssrCookieService: SsrCookieService){}
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     console.log('ApplyTokenInterceptor worked!', req.url)
//     if(typeof window !=='undefined'){
//       const token = this.ssrCookieService.get('token')  '';
//       if(token && token!=='') {
//         let newHeader = req.headers
//                                     .set('Authorization',Bearer ${token} );
//         req = req.clone({headers: newHeader});
//         return next.handle(req);
//       }
//     }
//     return next.handle(req);
//   }
// }