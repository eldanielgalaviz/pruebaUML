import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../../admin/services/admin.service';
import { ProfesorDialogComponent } from '../../../admin/dialogs/profesor-dialog/profesor-dialog.component';

@Component({
  selector: 'app-profesores-management',
  template: `
    <div class="management-container">
      <mat-toolbar color="primary">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span>Gestión de Profesores</span>
        <span class="spacer"></span>
        <button mat-raised-button color="accent" (click)="openDialog()">
          <mat-icon>add</mat-icon>
          Nuevo Profesor
        </button>
      </mat-toolbar>

      <div class="content">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Lista de Profesores</mat-card-title>
            <mat-card-subtitle>Administra los docentes del sistema</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="profesores" class="mat-elevation-z2">
              <!-- Columna ID Profesor -->
              <ng-container matColumnDef="idProfesor">
                <th mat-header-cell *matHeaderCellDef>ID Profesor</th>
                <td mat-cell *matCellDef="let profesor">{{ profesor.idProfesor }}</td>
              </ng-container>

              <!-- Columna Nombre -->
              <ng-container matColumnDef="nombre">
                <th mat-header-cell *matHeaderCellDef>Nombre</th>
                <td mat-cell *matCellDef="let profesor">
                  {{ profesor.usuario?.nombre }} {{ profesor.usuario?.apellidoPaterno }}
                </td>
              </ng-container>

              <!-- Columna Email -->
              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let profesor">{{ profesor.usuario?.email }}</td>
              </ng-container>

              <!-- Columna Horarios -->
              <ng-container matColumnDef="horarios">
                <th mat-header-cell *matHeaderCellDef>Horarios</th>
                <td mat-cell *matCellDef="let profesor">
                  <mat-icon>schedule</mat-icon>
                  {{ profesor.horarios?.length || 0 }}
                </td>
              </ng-container>

              <!-- Columna Acciones -->
              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let profesor">
                  <button mat-icon-button (click)="editProfesor(profesor)" matTooltip="Editar">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button (click)="viewHorarios(profesor)" matTooltip="Ver Horarios">
                    <mat-icon>schedule</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteProfesor(profesor)" matTooltip="Eliminar">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <div *ngIf="profesores.length === 0" class="no-data">
              <mat-icon>person</mat-icon>
              <p>No hay profesores registrados</p>
              <button mat-raised-button color="primary" (click)="openDialog()">
                Crear primer profesor
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

    .spacer {
      flex: 1 1 auto;
    }

    .content {
      padding: 20px;
    }

    table {
      width: 100%;
    }

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
export class ProfesoresManagementComponent implements OnInit {
  profesores: any[] = [];
  displayedColumns: string[] = ['idProfesor', 'nombre', 'email', 'horarios', 'acciones'];

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadProfesores();
  }

  loadProfesores(): void {
    this.adminService.getProfesores().subscribe({
      next: (profesores) => {
        this.profesores = profesores;
      },
      error: (error) => {
        console.error('Error al cargar profesores:', error);
        this.showMessage('Error al cargar profesores');
      }
    });
  }

  openDialog(profesor?: any): void {
    const dialogRef = this.dialog.open(ProfesorDialogComponent, {
      width: '600px',
      data: profesor
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProfesores();
      }
    });
  }

  editProfesor(profesor: any): void {
    this.openDialog(profesor);
  }

  viewHorarios(profesor: any): void {
    this.showMessage(`Ver horarios del profesor ${profesor.usuario.nombre}`);
  }

  deleteProfesor(profesor: any): void {
    if (confirm(`¿Está seguro de eliminar al profesor ${profesor.usuario.nombre}?`)) {
      this.adminService.deleteProfesor(profesor.id).subscribe({
        next: () => {
          this.showMessage('Profesor eliminado correctamente');
          this.loadProfesores();
        },
        error: (error) => {
          console.error('Error al eliminar profesor:', error);
          this.showMessage('Error al eliminar profesor');
        }
      });
    }
  }

  goBack(): void {
    window.history.back();
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000
    });
  }
}