// frontend/src/app/admin/services/admin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:3005/api';

  constructor(private http: HttpClient) {}

  // GESTIÓN DE GRUPOS
  getGrupos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/academic/grupos`);
  }

  getGrupo(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/academic/grupos/${id}`);
  }

  createGrupo(grupo: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/academic/grupos`, grupo);
  }

  updateGrupo(id: number, grupo: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/academic/grupos/${id}`, grupo);
  }

  deleteGrupo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/academic/grupos/${id}`);
  }

  // GESTIÓN DE HORARIOS
  getHorarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/academic/horarios`);
  }

  getHorario(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/academic/horarios/${id}`);
  }

  createHorario(horario: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/academic/horarios`, horario);
  }

  updateHorario(id: number, horario: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/academic/horarios/${id}`, horario);
  }

  deleteHorario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/academic/horarios/${id}`);
  }

  getHorariosByGrupo(grupoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/academic/horarios/by-grupo/${grupoId}`);
  }

  getHorariosByProfesor(profesorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/academic/horarios/by-profesor/${profesorId}`);
  }

  checkConflictosHorario(dia: string, horaInicio: string, horaFin: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/academic/horarios/conflicts`, {
      params: { dia, horaInicio, horaFin }
    });
  }

  // GESTIÓN DE AULAS
  getAulas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/academic/aulas`);
  }

  getAula(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/academic/aulas/${id}`);
  }

  createAula(aula: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/academic/aulas`, aula);
  }

  updateAula(id: number, aula: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/academic/aulas/${id}`, aula);
  }

  deleteAula(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/academic/aulas/${id}`);
  }

  getAulasDisponibles(dia?: string, horaInicio?: string, horaFin?: string): Observable<any[]> {
    const params: any = {};
    if (dia) params.dia = dia;
    if (horaInicio) params.horaInicio = horaInicio;
    if (horaFin) params.horaFin = horaFin;
    
    return this.http.get<any[]>(`${this.apiUrl}/academic/aulas/disponibles`, { params });
  }

  // GESTIÓN DE ALUMNOS
  getAlumnos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/academic/alumnos`);
  }

  getAlumno(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/academic/alumnos/${id}`);
  }

  createAlumno(alumno: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/academic/alumnos`, alumno);
  }

  updateAlumno(id: number, alumno: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/academic/alumnos/${id}`, alumno);
  }

  deleteAlumno(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/academic/alumnos/${id}`);
  }

  getAlumnosSinGrupo(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/academic/alumnos/sin-grupo`);
  }

  // GESTIÓN DE PROFESORES
  getProfesores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/academic/profesores`);
  }

  getProfesor(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/academic/profesores/${id}`);
  }

  createProfesor(profesor: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/academic/profesores`, profesor);
  }

  updateProfesor(id: number, profesor: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/academic/profesores/${id}`, profesor);
  }

  deleteProfesor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/academic/profesores/${id}`);
  }

  getHorariosDelProfesor(profesorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/academic/profesores/${profesorId}/horarios`);
  }

  // GESTIÓN DE ASISTENCIAS
  getAsistencias(fechaInicio?: string, fechaFin?: string, profesorId?: number): Observable<any[]> {
    const params: any = {};
    if (fechaInicio) params.fechaInicio = fechaInicio;
    if (fechaFin) params.fechaFin = fechaFin;
    if (profesorId) params.profesorId = profesorId;
    
    return this.http.get<any[]>(`${this.apiUrl}/academic/asistencias`, { params });
  }

  createAsistencia(asistencia: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/academic/asistencias`, asistencia);
  }

  updateAsistencia(id: number, asistencia: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/academic/asistencias/${id}`, asistencia);
  }

  deleteAsistencia(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/academic/asistencias/${id}`);
  }

  // ASIGNACIONES
  asignarAlumnoAGrupo(grupoId: number, alumnoId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/academic/grupos/${grupoId}/alumnos`, { alumnoId });
  }

  removerAlumnoDeGrupo(grupoId: number, alumnoId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/academic/grupos/${grupoId}/alumnos/${alumnoId}`);
  }

  getAlumnosDelGrupo(grupoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/academic/grupos/${grupoId}/alumnos`);
  }

  // REPORTES Y ESTADÍSTICAS
  getReporteAsistencias(fechaInicio: string, fechaFin: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/academic/asistencias/reporte`, {
      params: { fechaInicio, fechaFin }
    });
  }

  // USUARIOS DEL SISTEMA (para crear alumnos y profesores)
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  createUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users`, usuario);
  }
}