import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { User, UserRole } from '../core/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-container">
      <mat-toolbar color="primary">
        <span>Sistema de Asistencias</span>
        <span class="spacer"></span>
        <span *ngIf="currentUser">{{ currentUser.nombre }} {{ currentUser.apellidoPaterno }} ({{ roleLabel }})</span>
        <button mat-button (click)="logout()">
          <mat-icon>logout</mat-icon>
          Cerrar Sesión
        </button>
      </mat-toolbar>

      <div class="dashboard-content" style="padding: 20px;">
        <!-- Dashboard para ALUMNO -->
        <div *ngIf="isAlumno">
          <h2>Dashboard - Alumno</h2>
          <mat-card style="margin: 10px;">
            <mat-card-header>
              <mat-card-title>Mi Horario</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Ver mi horario de clases asignado</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="primary">Ver Horario</button>
            </mat-card-actions>
          </mat-card>
        </div>

        <!-- Dashboard para JEFE DE GRUPO -->
        <div *ngIf="isJefeGrupo">
          <h2>Dashboard - Jefe de Grupo</h2>
          <mat-card style="margin: 10px;">
            <mat-card-header>
              <mat-card-title>Horario del Grupo</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Ver el horario completo de mi grupo</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="primary">Ver Horario Grupo</button>
            </mat-card-actions>
          </mat-card>
        </div>

        <!-- Dashboard para PROFESOR -->
        <div *ngIf="isProfesor">
          <h2>Dashboard - Profesor</h2>
          <mat-card style="margin: 10px;">
            <mat-card-header>
              <mat-card-title>Mis Horarios</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Ver todos mis horarios asignados</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="primary">Ver Mis Horarios</button>
            </mat-card-actions>
          </mat-card>
        </div>

        <!-- Dashboard para CHECADOR -->
        <div *ngIf="isChecador">
          <h2>Dashboard - Checador</h2>
          <mat-card style="margin: 10px;">
            <mat-card-header>
              <mat-card-title>Gestionar Asistencias</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p>Marcar asistencia a todos los maestros</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="accent">Gestionar Asistencias</button>
            </mat-card-actions>
          </mat-card>
        </div>

        <!-- Dashboard para ADMINISTRADOR -->
        <div *ngIf="isAdministrador">
          <h2>Dashboard - Administrador</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Gestionar Alumnos</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p>Agregar, editar y eliminar alumnos</p>
              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="primary">Gestionar Alumnos</button>
              </mat-card-actions>
            </mat-card>

            <mat-card>
              <mat-card-header>
                <mat-card-title>Gestionar Profesores</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p>Agregar, editar y eliminar profesores</p>
              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="primary">Gestionar Profesores</button>
              </mat-card-actions>
            </mat-card>

            <mat-card>
              <mat-card-header>
                <mat-card-title>Gestionar Grupos</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p>Crear y administrar grupos</p>
              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="primary">Gestionar Grupos</button>
              </mat-card-actions>
            </mat-card>

            <mat-card>
              <mat-card-header>
                <mat-card-title>Reportes</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p>Generar reportes de asistencias</p>
              </mat-card-content>
              <mat-card-actions>
                <button mat-raised-button color="accent">Ver Reportes</button>
              </mat-card-actions>
            </mat-card>
          </div>
        </div>

        <!-- Mensaje si no hay rol asignado -->
        <div *ngIf="!userRole">
          <h2>Bienvenido</h2>
          <p>Tu cuenta no tiene un rol asignado. Contacta al administrador.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .spacer {
      flex: 1 1 auto;
    }
    .dashboard-content {
      min-height: calc(100vh - 64px);
      background-color: #f5f5f5;
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  userRole: UserRole | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('Dashboard iniciando...');
    
    this.currentUser = this.authService.currentUserValue;
    console.log('Usuario actual:', this.currentUser);
    
    if (!this.currentUser) {
      console.log('No hay usuario logueado, redirigiendo al login');
      this.router.navigate(['/auth/login']);
      return;
    }

    this.userRole = this.currentUser.rol;
    console.log('Rol del usuario:', this.userRole);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  get isAlumno(): boolean {
    return this.userRole === UserRole.ALUMNO;
  }

  get isJefeGrupo(): boolean {
    return this.userRole === UserRole.JEFE_GRUPO;
  }

  get isProfesor(): boolean {
    return this.userRole === UserRole.PROFESOR;
  }

  get isChecador(): boolean {
    return this.userRole === UserRole.CHECADOR;
  }

  get isAdministrador(): boolean {
    return this.userRole === UserRole.ADMINISTRADOR;
  }

  get roleLabel(): string {
    switch(this.userRole) {
      case UserRole.ALUMNO: return 'Alumno';
      case UserRole.JEFE_GRUPO: return 'Jefe de Grupo';
      case UserRole.PROFESOR: return 'Profesor';
      case UserRole.CHECADOR: return 'Checador';
      case UserRole.ADMINISTRADOR: return 'Administrador';
      default: return 'Usuario';
    }
  }

  navigateToAdmin(section: string): void {
    // Implementar navegación a secciones específicas de administración
    this.router.navigate(['/admin', section]);
  }
}