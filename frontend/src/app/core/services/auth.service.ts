// frontend/src/app/core/services/auth.service.ts - CON DEBUG
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3005/api/auth';
  public currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    console.log('🔍 AuthService init - Usuario almacenado:', storedUser);
    
    const user = storedUser ? JSON.parse(storedUser) : null;
    this.currentUserSubject = new BehaviorSubject<User | null>(user);
    this.currentUser = this.currentUserSubject.asObservable();
    
    console.log('🔍 AuthService init - Usuario parseado:', user);
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: any): Observable<any> {
    console.log('🚀 Iniciando login con credenciales:', { email: credentials.email });
    
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        console.log('✅ Response del login completo:', response);
        
        // Verificar estructura de la respuesta
        if (!response) {
          throw new Error('Respuesta vacía del servidor');
        }

        // Extraer token
        const token = response.token || response.access_token;
        if (!token) {
          console.error('❌ No se encontró token en la respuesta:', response);
          throw new Error('No se recibió token de autenticación');
        }

        // Extraer datos del usuario
        const userData = response.user;
        if (!userData) {
          console.error('❌ No se encontraron datos del usuario:', response);
          throw new Error('No se recibieron datos del usuario');
        }

        console.log('💾 Guardando token:', token);
        console.log('💾 Guardando usuario:', userData);

        // Guardar en localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Actualizar BehaviorSubject
        this.currentUserSubject.next(userData);
        
        console.log('✅ Login completado exitosamente');
        console.log('👤 Usuario actual:', this.currentUserValue);
        
        return response;
      }),
      catchError(error => {
        console.error('❌ Error en login:', error);
        console.error('❌ Status:', error.status);
        console.error('❌ Error body:', error.error);
        
        // Limpiar localStorage en caso de error
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
        
        return throwError(() => error);
      })
    );
  }

  register(user: any): Observable<any> {
    console.log('🚀 Registrando usuario:', { ...user, password: '[HIDDEN]' });
    
    return this.http.post<any>(`${this.apiUrl}/register`, user).pipe(
      tap(response => {
        console.log('✅ Usuario registrado:', response);
      }),
      catchError(error => {
        console.error('❌ Error en registro:', error);
        return throwError(() => error);
      })
    );
  }

  logout() {
    console.log('🚪 Cerrando sesión');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    console.log('✅ Sesión cerrada');
  }

  isLoggedIn(): boolean {
    const isLogged = !!this.currentUserValue;
    console.log('🔒 ¿Está logueado?', isLogged);
    return isLogged;
  }

  getUserRole(): string | null {
    const user = this.currentUserValue;
    const role = user ? user.rol || null : null;
    console.log('👑 Rol del usuario:', role);
    return role;
  }
}