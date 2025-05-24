// frontend/src/app/admin/services/admin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:3005/api/academic';

  constructor(private http: HttpClient) {}

  // GESTIÓN DE GRUPOS
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

  // GESTIÓN DE HORARIOS
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
    return this.http.get<any[]>(`${this.apiUrl}/horarios/by-grupo/${grupoId}`);
  }

  getHorariosByProfesor(profesorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/horarios/by-profesor/${profesorId}`);
  }

  checkConflictosHorario(dia: string, horaInicio: string, horaFin: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/horarios/conflicts`, {
      params: { dia, horaInicio, horaFin }
    });
  }

  // GESTIÓN DE AULAS
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

  // GESTIÓN DE ALUMNOS
  getAlumnos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/alumnos`);
  }

  getAlumnosSinGrupo(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/alumnos/sin-grupo`);
  }

  createAlumno(alumno: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/alumnos`, alumno);
  }

  // GESTIÓN DE PROFESORES
  getProfesores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/profesores`);
  }

  createProfesor(profesor: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/profesores`, profesor);
  }

  // ASIGNACIONES
  asignarAlumnoAGrupo(grupoId: number, alumnoId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/grupos/${grupoId}/alumnos`, { alumnoId });
  }

  removerAlumnoDeGrupo(grupoId: number, alumnoId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/grupos/${grupoId}/alumnos/${alumnoId}`);
  }

  getAlumnosDelGrupo(grupoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/grupos/${grupoId}/alumnos`);
  }

  // REPORTES Y ESTADÍSTICAS
  getOcupacionAulas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reportes/ocupacion-aulas`);
  }

  getHorariosSemana(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reportes/horarios-semana`);
  }

  getEstadisticasGrupos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reportes/estadisticas-grupos`);
  }
}