// frontend/src/app/admin/components/asistencias-management/asistencias-management.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../services/admin.service';
import { AsistenciaDialogComponent } from '../../dialogs/asistencia-dialog/asistencia-dialog.component';

@Component({
  selector: 'app-asistencias-management',
  template: `
    <div class="management-container">
      <mat-toolbar color="primary">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span>Gestión de Asistencias</span>
        <span class="spacer"></span>
        <button mat-raised-button color="accent" (click)="openDialog()">
          <mat-icon>add</mat-icon>
          Nueva Asistencia
        </button>
      </mat-toolbar>

      <div class="content">
        <!-- Filtros -->
        <mat-card class="filters-card">
          <mat-card-content>
            <div class="filters-row">
              <mat-form-field appearance="outline">
                <mat-label>Fecha Inicio</mat-label>
                <input matInput type="date" [(ngModel)]="fechaInicio" (change)="loadAsistencias()">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Fecha Fin</mat-label>
                <input matInput type="date" [(ngModel)]="fechaFin" (change)="loadAsistencias()">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Profesor</mat-label>
                <mat-select [(ngModel)]="profesorIdFiltro" (selectionChange)="loadAsistencias()">
                  <mat-option [value]="null">Todos los profesores</mat-option>
                  <mat-option *ngFor="let profesor of profesores" [value]="profesor.id">
                    {{ profesor.usuario?.nombre }} {{ profesor.usuario?.apellidoPaterno }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <button mat-raised-button (click)="clearFilters()">
                <mat-icon>clear</mat-icon>
                Limpiar Filtros
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Lista de Asistencias -->
        <mat-card>
          <mat-card-header>
            <mat-card-title>Registro de Asistencias</mat-card-title>
            <mat-card-subtitle>Control de asistencias de profesores</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="asistencias" class="mat-elevation-z2">
              <!-- Columna Fecha -->
              <ng-container matColumnDef="fecha">
                <th mat-header-cell *matHeaderCellDef>Fecha</th>
                <td mat-cell *matCellDef="let asistencia">{{ asistencia.fecha | date:'dd/MM/yyyy' }}</td>
              </ng-container>

              <!-- Columna Hora -->
              <ng-container matColumnDef="hora">
                <th mat-header-cell *matHeaderCellDef>Hora</th>
                <td mat-cell *matCellDef="let asistencia">{{ asistencia.hora }}</td>
              </ng-container>

              <!-- Columna Profesor -->
              <ng-container matColumnDef="profesor">
                <th mat-header-cell *matHeaderCellDef>Profesor</th>
                <td mat-cell *matCellDef="let asistencia">
                  {{ asistencia.profesor?.usuario?.nombre }} {{ asistencia.profesor?.usuario?.apellidoPaterno }}
                </td>
              </ng-container>

              <!-- Columna Materia -->
              <ng-container matColumnDef="materia">
                <th mat-header-cell *matHeaderCellDef>Materia</th>
                <td mat-cell *matCellDef="let asistencia">
                  {{ asistencia.horario?.materia || 'Sin horario' }}
                </td>
              </ng-container>

              <!-- Columna Estado -->
              <ng-container matColumnDef="estado">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let asistencia">
                  <mat-chip [color]="asistencia.asistio ? 'primary' : 'warn'" selected>
                    <mat-icon>{{ asistencia.asistio ? 'check_circle' : 'cancel' }}</mat-icon>
                    {{ asistencia.asistio ? 'Presente' : 'Ausente' }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Columna Observaciones -->
              <ng-container matColumnDef="observaciones">
                <th mat-header-cell *matHeaderCellDef>Observaciones</th>
                <td mat-cell *matCellDef="let asistencia">
                  {{ asistencia.observaciones || '-' }}
                </td>
              </ng-container>

              <!-- Columna Acciones -->
              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let asistencia">
                  <button mat-icon-button (click)="editAsistencia(asistencia)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteAsistencia(asistencia)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <div *ngIf="asistencias.length === 0" class="no-data">
              <mat-icon>assignment_turned_in</mat-icon>
              <p>No hay registros de asistencia</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .management-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }
    .spacer { flex: 1 1 auto; }
    .content { padding: 20px; }
    .filters-card { margin-bottom: 20px; }
    .filters-row {
      display: flex;
      gap: 15px;
      align-items: center;
      flex-wrap: wrap;
    }
    .filters-row mat-form-field {
      min-width: 200px;
    }
    table { width: 100%; }
    .no-data {
      text-align: center;
      padding: 40px;
      color: #666;
    }
    .no-data mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 20px;
    }
  `]
})
export class AsistenciasManagementComponent implements OnInit {
  asistencias: any[] = [];
  profesores: any[] = [];
  fechaInicio: string = '';
  fechaFin: string = '';
  profesorIdFiltro: number | null = null;
  displayedColumns: string[] = ['fecha', 'hora', 'profesor', 'materia', 'estado', 'observaciones', 'acciones'];

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { 
    // Configurar fechas por defecto (último mes)
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    this.fechaInicio = lastMonth.toISOString().split('T')[0];
    this.fechaFin = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.loadProfesores();
    this.loadAsistencias();
  }

  loadProfesores(): void {
    this.adminService.getProfesores().subscribe({
      next: (profesores) => {
        this.profesores = profesores;
      },
      error: (error) => {
        console.error('Error al cargar profesores:', error);
      }
    });
  }

  loadAsistencias(): void {
    // Por ahora mostrar mensaje de desarrollo
    this.showMessage('Funcionalidad en desarrollo');
    this.asistencias = [];
  }

  openDialog(asistencia?: any): void {
    const dialogRef = this.dialog.open(AsistenciaDialogComponent, {
      width: '500px',
      data: asistencia
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAsistencias();
      }
    });
  }

  editAsistencia(asistencia: any): void {
    this.openDialog(asistencia);
  }

  deleteAsistencia(asistencia: any): void {
    if (confirm(`¿Está seguro de eliminar este registro de asistencia?`)) {
      this.showMessage('Funcionalidad en desarrollo');
    }
  }

  clearFilters(): void {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.profesorIdFiltro = null;
    this.loadAsistencias();
  }

  goBack(): void {
    window.history.back();
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }
}