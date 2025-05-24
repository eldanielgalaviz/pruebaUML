import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../../admin/services/admin.service';
// import { HorarioDialogComponent } from '../../../admin/dialogs/horario-dialog/horario-dialog.component';
import { HorarioDialogComponent } from '../../../admin/dialogs/horario-dialog/horario-dialog.components';

@Component({
  selector: 'app-horarios-management',
  template: `
    <div class="management-container">
      <mat-toolbar color="primary">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span>Gestión de Horarios</span>
        <span class="spacer"></span>
        <button mat-raised-button color="accent" (click)="openDialog()">
          <mat-icon>add</mat-icon>
          Nuevo Horario
        </button>
      </mat-toolbar>

      <div class="content">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Lista de Horarios</mat-card-title>
            <mat-card-subtitle>Administra los horarios de clases</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="horarios" class="mat-elevation-z2">
              <!-- Columna Día -->
              <ng-container matColumnDef="dia">
                <th mat-header-cell *matHeaderCellDef>Día</th>
                <td mat-cell *matCellDef="let horario">{{ horario.dia | titlecase }}</td>
              </ng-container>

              <!-- Columna Hora -->
              <ng-container matColumnDef="hora">
                <th mat-header-cell *matHeaderCellDef>Horario</th>
                <td mat-cell *matCellDef="let horario">{{ horario.horaInicio }} - {{ horario.horaFin }}</td>
              </ng-container>

              <!-- Columna Materia -->
              <ng-container matColumnDef="materia">
                <th mat-header-cell *matHeaderCellDef>Materia</th>
                <td mat-cell *matCellDef="let horario">{{ horario.materia }}</td>
              </ng-container>

              <!-- Columna Grupo -->
              <ng-container matColumnDef="grupo">
                <th mat-header-cell *matHeaderCellDef>Grupo</th>
                <td mat-cell *matCellDef="let horario">{{ horario.grupo?.nombre }}</td>
              </ng-container>

              <!-- Columna Profesor -->
              <ng-container matColumnDef="profesor">
                <th mat-header-cell *matHeaderCellDef>Profesor</th>
                <td mat-cell *matCellDef="let horario">
                  {{ horario.profesor?.usuario?.nombre }} {{ horario.profesor?.usuario?.apellidoPaterno }}
                </td>
              </ng-container>

              <!-- Columna Aula -->
              <ng-container matColumnDef="aula">
                <th mat-header-cell *matHeaderCellDef>Aula</th>
                <td mat-cell *matCellDef="let horario">{{ horario.aula?.numero }}</td>
              </ng-container>

              <!-- Columna Acciones -->
              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let horario">
                  <button mat-icon-button (click)="editHorario(horario)" matTooltip="Editar">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteHorario(horario)" matTooltip="Eliminar">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <div *ngIf="horarios.length === 0" class="no-data">
              <mat-icon>schedule</mat-icon>
              <p>No hay horarios registrados</p>
              <button mat-raised-button color="primary" (click)="openDialog()">
                Crear primer horario
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
export class HorariosManagementComponent implements OnInit {
  horarios: any[] = [];
  displayedColumns: string[] = ['dia', 'hora', 'materia', 'grupo', 'profesor', 'aula', 'acciones'];

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadHorarios();
  }

  loadHorarios(): void {
    this.adminService.getHorarios().subscribe({
      next: (horarios) => {
        this.horarios = horarios;
      },
      error: (error) => {
        console.error('Error al cargar horarios:', error);
        this.showMessage('Error al cargar horarios');
      }
    });
  }

  openDialog(horario?: any): void {
    const dialogRef = this.dialog.open(HorarioDialogComponent, {
      width: '600px',
      data: horario
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadHorarios();
      }
    });
  }

  editHorario(horario: any): void {
    this.openDialog(horario);
  }

  deleteHorario(horario: any): void {
    if (confirm(`¿Está seguro de eliminar el horario de ${horario.materia}?`)) {
      this.adminService.deleteHorario(horario.id).subscribe({
        next: () => {
          this.showMessage('Horario eliminado correctamente');
          this.loadHorarios();
        },
        error: (error) => {
          console.error('Error al eliminar horario:', error);
          this.showMessage('Error al eliminar horario');
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