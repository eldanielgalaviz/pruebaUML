import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Obtener token del localStorage
    const token = localStorage.getItem('token');
    
    console.log('Interceptor - Token encontrado:', !!token);
    console.log('Interceptor - URL:', request.url);
    
    if (token) {
      // Clonar la request y agregar el header de autorización
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Interceptor - Header agregado:', request.headers.get('Authorization'));
    }

    return next.handle(request);
  }
}