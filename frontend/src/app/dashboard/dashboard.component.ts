// frontend/src/app/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { User, UserRole } from '../core/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
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

  // NAVEGACIÓN ESPECÍFICA PARA CADA ROL
  navigateToAdmin(section: string): void {
    console.log('Navegando a admin:', section);
    this.router.navigate(['/admin', section]);
  }

  navigateToProfesorHorarios(): void {
    console.log('Navegando a horarios del profesor');
    this.router.navigate(['/profesor/horarios']);
  }

  navigateToAlumnoHorarios(): void {
    console.log('Navegando a horarios del alumno');
    this.router.navigate(['/alumno/horarios']);
  }

  navigateToJefeGrupoHorarios(): void {
    console.log('Navegando a horarios del jefe de grupo');
    this.router.navigate(['/jefe-grupo/horarios']);
  }

  navigateToChecadorAsistencias(): void {
    console.log('Navegando a gestión de asistencias');
    this.router.navigate(['/checador/asistencias']);
  }

  // MÉTODOS GENÉRICOS
  verHorario(): void {
    switch(this.userRole) {
      case UserRole.PROFESOR:
        this.navigateToProfesorHorarios();
        break;
      case UserRole.ALUMNO:
        this.navigateToAlumnoHorarios();
        break;
      case UserRole.JEFE_GRUPO:
        this.navigateToJefeGrupoHorarios();
        break;
      default:
        console.log('Rol sin horarios específicos');
    }
  }

  marcarAsistencia(): void {
    if (this.userRole === UserRole.PROFESOR) {
      this.router.navigate(['/profesor/asistencia']);
    } else if (this.userRole === UserRole.CHECADOR) {
      this.navigateToChecadorAsistencias();
    }
  }

  gestionarAsistencias(): void {
    if (this.userRole === UserRole.CHECADOR) {
      this.navigateToChecadorAsistencias();
    }
  }
}