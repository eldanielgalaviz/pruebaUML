import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../../admin/services/admin.service';
import { AulaDialogComponent } from '../../../admin/dialogs/aula-dialog/aula-dialog.component';

@Component({
  selector: 'app-aulas-management',
  template: `
    <div class="management-container">
      <mat-toolbar color="primary">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span>Gestión de Aulas</span>
        <span class="spacer"></span>
        <button mat-raised-button color="accent" (click)="openDialog()">
          <mat-icon>add</mat-icon>
          Nueva Aula
        </button>
      </mat-toolbar>

      <div class="content">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Lista de Aulas</mat-card-title>
            <mat-card-subtitle>Administra los espacios físicos</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="aulas" class="mat-elevation-z2">
              <!-- Columna Número -->
              <ng-container matColumnDef="numero">
                <th mat-header-cell *matHeaderCellDef>Número</th>
                <td mat-cell *matCellDef="let aula">{{ aula.numero }}</td>
              </ng-container>

              <!-- Columna Capacidad -->
              <ng-container matColumnDef="capacidad">
                <th mat-header-cell *matHeaderCellDef>Capacidad</th>
                <td mat-cell *matCellDef="let aula">{{ aula.capacidad }} personas</td>
              </ng-container>

              <!-- Columna Ubicación -->
              <ng-container matColumnDef="ubicacion">
                <th mat-header-cell *matHeaderCellDef>Ubicación</th>
                <td mat-cell *matCellDef="let aula">{{ aula.ubicacion || 'No especificada' }}</td>
              </ng-container>

              <!-- Columna Acciones -->
              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let aula">
                  <button mat-icon-button (click)="editAula(aula)" matTooltip="Editar">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button (click)="viewHorarios(aula)" matTooltip="Ver Horarios">
                    <mat-icon>schedule</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteAula(aula)" matTooltip="Eliminar">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <div *ngIf="aulas.length === 0" class="no-data">
              <mat-icon>meeting_room</mat-icon>
              <p>No hay aulas registradas</p>
              <button mat-raised-button color="primary" (click)="openDialog()">
                Crear primera aula
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
export class AulasManagementComponent implements OnInit {
  aulas: any[] = [];
  displayedColumns: string[] = ['numero', 'capacidad', 'ubicacion', 'acciones'];

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadAulas();
  }

  loadAulas(): void {
    this.adminService.getAulas().subscribe({
      next: (aulas) => {
        this.aulas = aulas;
      },
      error: (error) => {
        console.error('Error al cargar aulas:', error);
        this.showMessage('Error al cargar aulas');
      }
    });
  }

  openDialog(aula?: any): void {
    const dialogRef = this.dialog.open(AulaDialogComponent, {
      width: '500px',
      data: aula
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAulas();
      }
    });
  }

  editAula(aula: any): void {
    this.openDialog(aula);
  }

  viewHorarios(aula: any): void {
    this.showMessage(`Ver horarios del aula ${aula.numero}`);
  }

  deleteAula(aula: any): void {
    if (confirm(`¿Está seguro de eliminar el aula ${aula.numero}?`)) {
      this.adminService.deleteAula(aula.id).subscribe({
        next: () => {
          this.showMessage('Aula eliminada correctamente');
          this.loadAulas();
        },
        error: (error) => {
          console.error('Error al eliminar aula:', error);
          this.showMessage('Error al eliminar aula');
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