// frontend/src/app/admin/components/admin-dashboard/admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div class="admin-dashboard">
      <mat-toolbar color="primary">
        <span>Panel de Administración</span>
        <span class="spacer"></span>
        <button mat-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
          Volver al Dashboard
        </button>
      </mat-toolbar>

      <!-- Dashboard principal -->
      <div class="dashboard-content">
        <div class="admin-cards">
          <mat-card class="admin-card" (click)="navigateTo('grupos')">
            <mat-card-header>
              <mat-icon mat-card-avatar color="primary">group</mat-icon>
              <mat-card-title>Gestionar Grupos</mat-card-title>
              <mat-card-subtitle>Crear y administrar grupos de estudiantes</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>✅ <strong>Funcional</strong> - Administra grupos, asigna alumnos y gestiona la información académica.</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="primary">Gestionar</button>
            </mat-card-actions>
          </mat-card>

          <mat-card class="admin-card" (click)="navigateTo('asistencias')">
            <mat-card-header>
              <mat-icon mat-card-avatar color="accent">assignment_turned_in</mat-icon>
              <mat-card-title>Gestionar Asistencias</mat-card-title>
              <mat-card-subtitle>Control de asistencias y reportes</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>✅ <strong>Funcional</strong> - Controla asistencias, genera reportes y estadísticas.</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="accent">Ver Asistencias</button>
            </mat-card-actions>
          </mat-card>

          <mat-card class="admin-card" (click)="navigateTo('horarios')">
            <mat-card-header>
              <mat-icon mat-card-avatar color="primary">schedule</mat-icon>
              <mat-card-title>Gestionar Horarios</mat-card-title>
              <mat-card-subtitle>Crear y asignar horarios de clases</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>✅ <strong>Funcional</strong> - Crea horarios, asigna profesores y aulas, verifica conflictos.</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="primary">Gestionar</button>
            </mat-card-actions>
          </mat-card>

          <mat-card class="admin-card" (click)="navigateTo('aulas')">
            <mat-card-header>
              <mat-icon mat-card-avatar color="primary">meeting_room</mat-icon>
              <mat-card-title>Gestionar Aulas</mat-card-title>
              <mat-card-subtitle>Administrar espacios físicos</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>✅ <strong>Funcional</strong> - Registra aulas, define capacidades y verifica disponibilidad.</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="primary">Gestionar</button>
            </mat-card-actions>
          </mat-card>

          <mat-card class="admin-card" (click)="navigateTo('alumnos')">
            <mat-card-header>
              <mat-icon mat-card-avatar color="primary">school</mat-icon>
              <mat-card-title>Gestionar Alumnos</mat-card-title>
              <mat-card-subtitle>Administrar estudiantes</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>✅ <strong>Funcional</strong> - Registra alumnos, asigna a grupos y gestiona información académica.</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="primary">Gestionar</button>
            </mat-card-actions>
          </mat-card>

          <mat-card class="admin-card" (click)="navigateTo('profesores')">
            <mat-card-header>
              <mat-icon mat-card-avatar color="primary">person</mat-icon>
              <mat-card-title>Gestionar Profesores</mat-card-title>
              <mat-card-subtitle>Administrar docentes</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>✅ <strong>Funcional</strong> - Registra profesores, asigna materias y gestiona horarios docentes.</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button color="primary">Gestionar</button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .dashboard-content {
      padding: 20px;
    }

    .admin-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .admin-card {
      cursor: pointer;
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }

    .admin-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .admin-card mat-card-header {
      margin-bottom: 15px;
    }

    .admin-card mat-icon[mat-card-avatar] {
      font-size: 40px;
      width: 40px;
      height: 40px;
      line-height: 40px;
    }

    .admin-card mat-card-actions {
      justify-content: flex-end;
      padding: 16px;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

  navigateTo(section: string): void {
    this.router.navigate(['/admin', section]);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}