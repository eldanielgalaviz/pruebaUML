// frontend/src/app/profesor/profesor-horarios/profesor-horarios.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profesor-horarios',
  template: `
    <div class="horarios-container">
      <mat-toolbar color="primary">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span>Mis Horarios</span>
        <span class="spacer"></span>
        <span>{{ profesorInfo?.nombre }}</span>
      </mat-toolbar>

      <div class="content" *ngIf="!loading">
        <!-- Información del profesor -->
        <mat-card class="profesor-info">
          <mat-card-header>
            <mat-card-title>Información del Profesor</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p><strong>ID Profesor:</strong> {{ profesorInfo?.idProfesor }}</p>
            <p><strong>Nombre:</strong> {{ profesorInfo?.nombre }} {{ profesorInfo?.apellidoPaterno }}</p>
            <p><strong>Total de horas:</strong> {{ horarios.length }}</p>
          </mat-card-content>
        </mat-card>

        <!-- Horarios por día -->
        <div class="horarios-semana">
          <mat-card *ngFor="let dia of diasSemana" class="dia-card">
            <mat-card-header>
              <mat-card-title>{{ dia.nombre }}</mat-card-title>
              <mat-card-subtitle>{{ dia.horarios.length }} clases</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div *ngIf="dia.horarios.length === 0" class="no-clases">
                Sin clases programadas
              </div>
              <div *ngFor="let horario of dia.horarios" class="horario-item">
                <div class="horario-time">
                  <mat-icon>schedule</mat-icon>
                  {{ horario.horaInicio }} - {{ horario.horaFin }}
                </div>
                <div class="horario-details">
                  <h4>{{ horario.materia }}</h4>
                  <p>
                    <mat-icon>group</mat-icon>
                    {{ horario.grupo?.nombre }}
                  </p>
                  <p>
                    <mat-icon>meeting_room</mat-icon>
                    Aula {{ horario.aula?.numero }}
                  </p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Resumen estadístico -->
        <mat-card class="estadisticas">
          <mat-card-header>
            <mat-card-title>Resumen Semanal</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-number">{{ horarios.length }}</span>
                <span class="stat-label">Total Horas</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ getTotalMaterias() }}</span>
                <span class="stat-label">Materias</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ getTotalGrupos() }}</span>
                <span class="stat-label">Grupos</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ getTotalAulas() }}</span>
                <span class="stat-label">Aulas</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="loading-container">
        <mat-spinner></mat-spinner>
        <p>Cargando horarios...</p>
      </div>

      <!-- Error -->
      <div *ngIf="error" class="error-container">
        <mat-icon color="warn">error</mat-icon>
        <p>{{ error }}</p>
        <button mat-raised-button color="primary" (click)="loadHorarios()">
          Reintentar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .horarios-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .content {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .profesor-info {
      margin-bottom: 20px;
    }

    .horarios-semana {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }

    .dia-card {
      min-height: 200px;
    }

    .no-clases {
      text-align: center;
      color: #666;
      padding: 20px;
      font-style: italic;
    }

    .horario-item {
      display: flex;
      align-items: center;
      padding: 10px;
      margin: 5px 0;
      background-color: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #2196f3;
    }

    .horario-time {
      display: flex;
      align-items: center;
      min-width: 120px;
      font-weight: bold;
      color: #2196f3;
    }

    .horario-time mat-icon {
      margin-right: 5px;
      font-size: 18px;
    }

    .horario-details {
      flex: 1;
      margin-left: 15px;
    }

    .horario-details h4 {
      margin: 0 0 5px 0;
      color: #333;
    }

    .horario-details p {
      margin: 3px 0;
      display: flex;
      align-items: center;
      color: #666;
      font-size: 14px;
    }

    .horario-details mat-icon {
      margin-right: 5px;
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .estadisticas {
      margin-top: 20px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
      text-align: center;
    }

    .stat-item {
      padding: 20px;
      background-color: #e3f2fd;
      border-radius: 8px;
    }

    .stat-number {
      display: block;
      font-size: 2em;
      font-weight: bold;
      color: #1976d2;
    }

    .stat-label {
      display: block;
      color: #666;
      margin-top: 5px;
    }

    .loading-container, .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 50vh;
      text-align: center;
    }

    .error-container mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 20px;
    }
  `]
})
export class ProfesorHorariosComponent implements OnInit {
  horarios: any[] = [];
  profesorInfo: any = null;
  loading = true;
  error: string | null = null;

  diasSemana = [
    { nombre: 'Lunes', key: 'lunes', horarios: [] },
    { nombre: 'Martes', key: 'martes', horarios: [] },
    { nombre: 'Miércoles', key: 'miercoles', horarios: [] },
    { nombre: 'Jueves', key: 'jueves', horarios: [] },
    { nombre: 'Viernes', key: 'viernes', horarios: [] },
    { nombre: 'Sábado', key: 'sabado', horarios: [] },
    { nombre: 'Domingo', key: 'domingo', horarios: [] }
  ];

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadHorarios();
  }

  loadHorarios(): void {
    this.loading = true;
    this.error = null;

    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      this.error = 'Usuario no autenticado';
      this.loading = false;
      return;
    }

    // Primero necesitamos obtener el ID del profesor basado en el usuario
    this.http.get<any[]>(`http://localhost:3005/api/profesores`).subscribe({
      next: (profesores) => {
        const profesor = profesores.find(p => p.usuario.id === currentUser.id);
        
        if (!profesor) {
          this.error = 'No se encontró información del profesor';
          this.loading = false;
          return;
        }

        this.profesorInfo = {
          idProfesor: profesor.idProfesor,
          nombre: profesor.usuario.nombre,
          apellidoPaterno: profesor.usuario.apellidoPaterno
        };

        // Ahora obtenemos los horarios del profesor
        this.http.get<any[]>(`http://localhost:3005/api/horarios/profesor/${profesor.id}`).subscribe({
          next: (horarios) => {
            this.horarios = horarios;
            this.organizarHorariosPorDia();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error al cargar horarios:', error);
            this.error = 'Error al cargar los horarios';
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error al buscar profesor:', error);
        this.error = 'Error al buscar información del profesor';
        this.loading = false;
      }
    });
  }

  organizarHorariosPorDia(): void {
    // Limpiar horarios anteriores
    this.diasSemana.forEach(dia => dia.horarios = []);

    // Organizar horarios por día
    this.horarios.forEach(horario => {
      const dia = this.diasSemana.find(d => d.key === horario.dia.toLowerCase());
      if (dia) {
        dia.horarios.push(horario);
      }
    });

    // Ordenar horarios por hora de inicio
    this.diasSemana.forEach(dia => {
      dia.horarios.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
    });
  }

  getTotalMaterias(): number {
    const materias = new Set(this.horarios.map(h => h.materia));
    return materias.size;
  }

  getTotalGrupos(): number {
    const grupos = new Set(this.horarios.map(h => h.grupo?.nombre));
    return grupos.size;
  }

  getTotalAulas(): number {
    const aulas = new Set(this.horarios.map(h => h.aula?.numero));
    return aulas.size;
  }

  goBack(): void {
    window.history.back();
  }
}