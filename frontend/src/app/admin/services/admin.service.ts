// frontend/src/app/admin/services/admin.service.ts - CORREGIDO
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:3005/api'; // ✅ Cambiar base URL

  constructor(private http: HttpClient) {}

  // GESTIÓN DE GRUPOS - ✅ CORREGIDO
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

  // GESTIÓN DE HORARIOS - ✅ CORREGIDO
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

  // GESTIÓN DE AULAS - ✅ CORREGIDO
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

  // GESTIÓN DE ALUMNOS - ✅ CORREGIDO
  getAlumnos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/alumnos/all`); // ✅ Usar endpoint existente
  }

  getAlumnosSinGrupo(): Observable<any[]> {
    // Implementar lógica para filtrar alumnos sin grupo en el frontend
    return this.http.get<any[]>(`${this.apiUrl}/users/alumnos/all`);
  }

  createAlumno(alumno: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/alumno`, alumno); // ✅ Usar endpoint existente
  }

  // GESTIÓN DE PROFESORES - ✅ CORREGIDO
  getProfesores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/profesores`);
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

  // ASIGNACIONES - ✅ CORREGIDO
  asignarAlumnoAGrupo(grupoId: number, alumnoId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/grupos/${grupoId}/alumnos/${alumnoId}`, {});
  }

  removerAlumnoDeGrupo(grupoId: number, alumnoId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/grupos/${grupoId}/alumnos/${alumnoId}`);
  }

  getAlumnosDelGrupo(grupoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/grupos/${grupoId}/alumnos`);
  }

  // REPORTES Y ESTADÍSTICAS - ✅ CORREGIDO
  getOcupacionAulas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/horarios/ocupacion-aulas`);
  }

  getHorariosSemana(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/horarios/semana`);
  }

  getEstadisticasGrupos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/grupos/estadisticas`);
  }

  getProfesoresDisponibles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/profesores/disponibles`);
  }

  getEstadisticasProfesores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/profesores/estadisticas`);
  }

  // MÉTODOS ADICIONALES FALTANTES

  // ALUMNOS
  updateAlumno(id: number, alumno: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/users/${id}`, alumno);
  }

  deleteAlumno(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  // ASISTENCIAS
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

  updateAsistencia(id: number, asistencia: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/asistencias/${id}`, asistencia);
  }

  deleteAsistencia(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/asistencias/${id}`);
  }

  // HORARIOS DE PROFESOR
  getHorariosDelProfesor(profesorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/horarios/profesor/${profesorId}`);
  }

  // REPORTES DE ASISTENCIAS
  getReporteAsistencias(fechaInicio: string, fechaFin: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/asistencias/reporte`, {
      params: { fechaInicio, fechaFin }
    });
  }
}