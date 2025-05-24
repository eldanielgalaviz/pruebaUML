// frontend/src/app/admin/components/profesores-management/profesores-management.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../services/admin.service';

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
            <mat-card-subtitle>Administra los profesores del sistema</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="temp-message">
              <h3>Sección en Desarrollo</h3>
              <p>La gestión de profesores estará disponible próximamente.</p>
              <button mat-raised-button color="primary" (click)="goBack()">
                Volver al Panel
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
    .temp-message {
      text-align: center;
      padding: 40px;
      color: #666;
    }
  `]
})
export class ProfesoresManagementComponent implements OnInit {

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  openDialog(): void {
    this.showMessage('Funcionalidad en desarrollo');
  }

  goBack(): void {
    window.history.back();
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }
}