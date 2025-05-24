// frontend/src/app/admin/components/grupos-management/grupos-management.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../services/admin.service';
import { GrupoDialogComponent } from '../../dialogs/grupo-dialog/grupo-dialog.component';

@Component({
  selector: 'app-grupos-management',
  template: `
    <div class="management-container">
      <mat-toolbar color="primary">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span>Gestión de Grupos</span>
        <span class="spacer"></span>
        <button mat-raised-button color="accent" (click)="openDialog()">
          <mat-icon>add</mat-icon>
          Nuevo Grupo
        </button>
      </mat-toolbar>

      <div class="content">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Lista de Grupos</mat-card-title>
            <mat-card-subtitle>Administra los grupos del sistema</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="grupos" class="mat-elevation-z2">
              <!-- Columna Código -->
              <ng-container matColumnDef="codigo">
                <th mat-header-cell *matHeaderCellDef>Código</th>
                <td mat-cell *matCellDef="let grupo">{{ grupo.codigo }}</td>
              </ng-container>

              <!-- Columna Nombre -->
              <ng-container matColumnDef="nombre">
                <th mat-header-cell *matHeaderCellDef>Nombre</th>
                <td mat-cell *matCellDef="let grupo">{{ grupo.nombre }}</td>
              </ng-container>

              <!-- Columna Grado -->
              <ng-container matColumnDef="grado">
                <th mat-header-cell *matHeaderCellDef>Grado</th>
                <td mat-cell *matCellDef="let grupo">{{ grupo.grado }}</td>
              </ng-container>

              <!-- Columna Período -->
              <ng-container matColumnDef="periodo">
                <th mat-header-cell *matHeaderCellDef>Período</th>
                <td mat-cell *matCellDef="let grupo">{{ grupo.periodo }}</td>
              </ng-container>

              <!-- Columna Alumnos -->
              <ng-container matColumnDef="alumnos">
                <th mat-header-cell *matHeaderCellDef>Alumnos</th>
                <td mat-cell *matCellDef="let grupo">
                  <mat-icon>group</mat-icon>
                  {{ grupo.alumnos?.length || 0 }}
                </td>
              </ng-container>

              <!-- Columna Acciones -->
              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef>Acciones</th>
                <td mat-cell *matCellDef="let grupo">
                  <button mat-icon-button (click)="editGrupo(grupo)" matTooltip="Editar">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button (click)="viewAlumnos(grupo)" matTooltip="Ver Alumnos">
                    <mat-icon>group</mat-icon>
                  </button>
                  <button mat-icon-button (click)="viewHorarios(grupo)" matTooltip="Ver Horarios">
                    <mat-icon>schedule</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteGrupo(grupo)" matTooltip="Eliminar">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>

            <div *ngIf="grupos.length === 0" class="no-data">
              <mat-icon>info</mat-icon>
              <p>No hay grupos registrados</p>
              <button mat-raised-button color="primary" (click)="openDialog()">
                Crear primer grupo
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
export class GruposManagementComponent implements OnInit {
  grupos: any[] = [];
  displayedColumns: string[] = ['codigo', 'nombre', 'grado', 'periodo', 'alumnos', 'acciones'];

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadGrupos();
  }

  loadGrupos(): void {
    this.adminService.getGrupos().subscribe({
      next: (grupos) => {
        this.grupos = grupos;
      },
      error: (error) => {
        console.error('Error al cargar grupos:', error);
        this.showMessage('Error al cargar grupos');
      }
    });
  }

  openDialog(grupo?: any): void {
    const dialogRef = this.dialog.open(GrupoDialogComponent, {
      width: '500px',
      data: grupo
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGrupos();
      }
    });
  }

  editGrupo(grupo: any): void {
    this.openDialog(grupo);
  }

  viewAlumnos(grupo: any): void {
    // Implementar vista de alumnos del grupo
    this.showMessage(`Ver alumnos del grupo ${grupo.nombre}`);
  }

  viewHorarios(grupo: any): void {
    // Implementar vista de horarios del grupo
    this.showMessage(`Ver horarios del grupo ${grupo.nombre}`);
  }

  deleteGrupo(grupo: any): void {
    if (confirm(`¿Está seguro de eliminar el grupo ${grupo.nombre}?`)) {
      this.adminService.deleteGrupo(grupo.id).subscribe({
        next: () => {
          this.showMessage('Grupo eliminado correctamente');
          this.loadGrupos();
        },
        error: (error) => {
          console.error('Error al eliminar grupo:', error);
          this.showMessage('Error al eliminar grupo');
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