import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:3005/api';

  constructor(private http: HttpClient) {}

  // ==================== GESTIÓN DE GRUPOS ====================
  getGrupos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/grupos`);
  }

  getGrupo(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/grupos/${id}`);
  }

  createGrupo(grupo: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/grupos`, grupo);
  }

  updateGrupo(id: number, grupo: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/grupos/${id}`, grupo);
  }

  deleteGrupo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/grupos/${id}`);
  }

  getAlumnosDelGrupo(grupoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/grupos/${grupoId}/alumnos`);
  }

  asignarAlumnoAGrupo(grupoId: number, alumnoId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/grupos/${grupoId}/alumnos/${alumnoId}`, {});
  }

  removerAlumnoDeGrupo(grupoId: number, alumnoId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/grupos/${grupoId}/alumnos/${alumnoId}`);
  }

  // ==================== GESTIÓN DE HORARIOS ====================
  getHorarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/horarios`);
  }

  getHorario(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/horarios/${id}`);
  }

  createHorario(horario: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/horarios`, horario);
  }

  updateHorario(id: number, horario: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/horarios/${id}`, horario);
  }

  deleteHorario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/horarios/${id}`);
  }

  getHorariosByGrupo(grupoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/horarios/grupo/${grupoId}`);
  }

  getHorariosByProfesor(profesorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/horarios/profesor/${profesorId}`);
  }

  checkConflictosHorario(dia: string, horaInicio: string, horaFin: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/horarios/conflictos`, {
      params: { dia, horaInicio, horaFin }
    });
  }

  // ==================== GESTIÓN DE AULAS ====================
  getAulas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/aulas`);
  }

  getAula(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/aulas/${id}`);
  }

  createAula(aula: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/aulas`, aula);
  }

  updateAula(id: number, aula: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/aulas/${id}`, aula);
  }

  deleteAula(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/aulas/${id}`);
  }

  getAulasDisponibles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/aulas/disponibles`);
  }

  // ==================== GESTIÓN DE ALUMNOS ====================
  getAlumnos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/alumnos`);
  }

  getAlumno(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/alumnos/${id}`);
  }

  createAlumno(alumno: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/alumnos`, alumno);
  }

  updateAlumno(id: number, alumno: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/alumnos/${id}`, alumno);
  }

  deleteAlumno(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/alumnos/${id}`);
  }

  getAlumnosSinGrupo(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/alumnos/sin-grupo`);
  }

  getHorariosDelAlumno(alumnoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/alumnos/${alumnoId}/horarios`);
  }

  // ==================== GESTIÓN DE PROFESORES ====================
  getProfesores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/profesores`);
  }

  getProfesor(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profesores/${id}`);
  }

  createProfesor(profesor: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/profesores`, profesor);
  }

  updateProfesor(id: number, profesor: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/profesores/${id}`, profesor);
  }

  deleteProfesor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/profesores/${id}`);
  }

  getProfesoresDisponibles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/profesores/disponibles`);
  }

  // ==================== GESTIÓN DE ASISTENCIAS ====================
  getAsistencias(fechaInicio?: string, fechaFin?: string, profesorId?: number): Observable<any[]> {
    let params: any = {};
    if (fechaInicio) params.fechaInicio = fechaInicio;
    if (fechaFin) params.fechaFin = fechaFin;
    if (profesorId) params.profesorId = profesorId;
    
    return this.http.get<any[]>(`${this.apiUrl}/asistencias`, { params });
  }

  createAsistencia(asistencia: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/asistencias`, asistencia);
  }

  marcarAsistencia(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/asistencias/marcar`, data);
  }

  getAsistenciasPorProfesor(profesorId: number, fechaInicio?: string, fechaFin?: string): Observable<any> {
    let params: any = {};
    if (fechaInicio) params.fechaInicio = fechaInicio;
    if (fechaFin) params.fechaFin = fechaFin;
    
    return this.http.get<any>(`${this.apiUrl}/asistencias/profesor/${profesorId}`, { params });
  }

  updateAsistencia(id: number, asistencia: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/asistencias/${id}`, asistencia);
  }

  deleteAsistencia(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/asistencias/${id}`);
  }

  // ==================== REPORTES ====================
  getEstadisticasGrupos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/grupos/estadisticas`);
  }

  getOcupacionAulas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/aulas/estadisticas`);
  }

  getHorariosSemana(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/horarios/semana`);
  }
}