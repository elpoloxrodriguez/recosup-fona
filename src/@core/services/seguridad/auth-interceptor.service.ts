
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  
    const token: string = sessionStorage.getItem('token')

    let request = req;

    if (token) {
      // request = req.clone({
      //   setHeaders: {
      //     authorization: `Bearer ${ token }`
      //   }
      // });
    }
    
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        switch(err.status){
          case 401:
            sessionStorage.removeItem('token')
            this.cerrar(err.error.msj)
          break;
          case 403:
            sessionStorage.removeItem('token')
            this.cerrar(err.error.msj)
          break;
          case 504:
            sessionStorage.removeItem('token')
            this.cerrar(err.error)
          break
        }
        return throwError( err );
      })
    )
  }

  cerrar(msj : string){
    Swal.fire({
      title: 'Alerta',
      text: msj,
      icon: 'error',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Gracias por su tiempo!'
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem('token')
        window.location.href = '/';
      }
    })    
  }
}