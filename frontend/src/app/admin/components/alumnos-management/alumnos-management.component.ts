// frontend/src/app/admin/components/alumnos-management/alumnos-management.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../services/admin.service';
import { AlumnoDialogComponent } from '../../dialogs/alumno-dialog/alumno-dialog.component';
import { AsignacionGrupoDialogComponent } from '../../dialogs/asignacion-grupo-dialog/asignacion-grupo-dialog.component';

@Component({
  selector: 'app-alumnos-management',
  template: `
    <div class="management-container">
      <mat-toolbar color="primary">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span>Gestión de Alumnos</span>
        <span class="spacer"></span>
        <button mat-raised-button color="accent" (click)="openDialog()">
          <mat-icon>add</mat-icon>
          Nuevo Alumno
        </button>
        <button mat-raised-button color="primary" (click)="openAsignacionDialog()">
          <mat-icon>group_add</mat-icon>
          Asignar a Grupo
        </button>
      </mat-toolbar>

      <div class="content">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Lista de Alumnos</mat-card-title>
            <mat-card-subtitle>Administra los alumnos del sistema</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="alumnos" class="mat-elevation-z2">
              <!-- Columna Matrícula -->
              <ng-container matColumnDef="matricula">
                <th mat-header-cell *matHeaderCellDef>Matrícula</th>
                <td mat-cell *matCellDef="let alumno">{{ alumno.matricula }}</td>
              </ng-container>

              <!-- Columna Nombre -->
              <ng-container matColumnDef="nombre">
                <th mat-header-cell *matHeaderCellDef>Nombre</th>
                <td mat-cell *matCellDef="let alumno">
                  {{ alumno.usuario?.nombre }} {{ alumno.usuario?.apellidoPaterno }} {{ alumno.usuario?.apellidoMaterno }}
                </td>
              </ng-container>

              <!-- Columna Email -->
              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let alumno">{{ alumno.usuario?.email }}</td>
              </ng-container>

              <!-- Columna Grupo -->
              <ng-container matColumnDef="grupo">
                <th mat-header-cell *matHeaderCellDef>Grupo</th>
                <td mat-cell *matCellDef="let alumno">
                  <mat-chip *ngIf="alumno.grupo" color="primary" selected>
                    {{ alumno.grupo.codigo }} - {{ alumno.grupo.nombre }}
                  </mat-chip>
                  <mat-chip *ngIf="!alumno.grupo" color="warn" selected>
                    Sin grupo
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Columna Estado -->
              <ng-container matColumnDef="estado">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let alumno">
                  <mat-chip [color]="alumno.activo ? 'primary' : 'warn'" selected>
                    {{ alumno.activo ? 'Activo' : 'Inactivo' }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Columna Acciones -->
              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let alumno">
                  <button mat-icon-button (click)="editAlumno(alumno)" matTooltip="Editar">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button (click)="asignarGrupo(alumno)" matTooltip="Asignar Grupo">
                    <mat-icon>group_add</mat-icon>
                  </button>
                  <button mat-icon-button (click)="viewHorarios(alumno)" matTooltip="Ver Horarios">
                    <mat-icon>schedule</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteAlumno(alumno)" matTooltip="Eliminar">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <div *ngIf="alumnos.length === 0" class="no-data">
              <mat-icon>school</mat-icon>
              <p>No hay alumnos registrados</p>
              <button mat-raised-button color="primary" (click)="openDialog()">
                Crear primer alumno
              </button>
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
    mat-toolbar button {
      margin-left: 10px;
    }
  `]
})
export class AlumnosManagementComponent implements OnInit {
  alumnos: any[] = [];
  displayedColumns: string[] = ['matricula', 'nombre', 'email', 'grupo', 'estado', 'acciones'];

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadAlumnos();
  }

  loadAlumnos(): void {
    this.adminService.getAlumnos().subscribe({
      next: (alumnos) => {
        this.alumnos = alumnos;
      },
      error: (error) => {
        console.error('Error al cargar alumnos:', error);
        this.showMessage('Error al cargar alumnos');
      }
    });
  }

  openDialog(alumno?: any): void {
    const dialogRef = this.dialog.open(AlumnoDialogComponent, {
      width: '600px',
      data: alumno
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAlumnos();
      }
    });
  }

  openAsignacionDialog(): void {
    const dialogRef = this.dialog.open(AsignacionGrupoDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAlumnos();
      }
    });
  }

  editAlumno(alumno: any): void {
    this.openDialog(alumno);
  }

  asignarGrupo(alumno: any): void {
    const dialogRef = this.dialog.open(AsignacionGrupoDialogComponent, {
      width: '500px',
      data: { alumno }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAlumnos();
      }
    });
  }

  viewHorarios(alumno: any): void {
    this.showMessage(`Ver horarios del alumno ${alumno.usuario?.nombre} - Funcionalidad en desarrollo`);
  }

  deleteAlumno(alumno: any): void {
    if (confirm(`¿Está seguro de eliminar al alumno ${alumno.usuario?.nombre}?`)) {
      this.adminService.deleteAlumno(alumno.id).subscribe({
        next: () => {
          this.showMessage('Alumno eliminado correctamente');
          this.loadAlumnos();
        },
        error: (error) => {
          console.error('Error al eliminar alumno:', error);
          this.showMessage('Error al eliminar alumno');
        }
      });
    }
  }

  goBack(): void {
    window.history.back();
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }
}