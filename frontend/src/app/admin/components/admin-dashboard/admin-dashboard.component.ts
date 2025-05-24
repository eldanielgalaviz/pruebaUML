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

      <!-- Mostrar mensaje si está en ruta "en desarrollo" -->
      <div *ngIf="isTemporaryRoute()" class="temp-message">
        <mat-card>
          <mat-card-header>
            <mat-icon mat-card-avatar color="warn">construction</mat-icon>
            <mat-card-title>Sección en Desarrollo</mat-card-title>
            <mat-card-subtitle>{{ getSectionName() }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>Esta funcionalidad está en desarrollo. Por ahora puedes usar:</p>
            <ul>
              <li><strong>Gestión de Grupos</strong> - Completamente funcional</li>
              <li>Otras secciones se implementarán próximamente</li>
            </ul>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="navigateTo('grupos')">
              Ir a Gestión de Grupos
            </button>
            <button mat-button (click)="goBack()">Volver</button>
          </mat-card-actions>
        </mat-card>
      </div>

      <!-- Dashboard principal cuando está en /admin -->
      <div *ngIf="!isTemporaryRoute()" class="dashboard-content">
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

          <mat-card class="admin-card disabled" (click)="showComingSoon('Horarios')">
            <mat-card-header>
              <mat-icon mat-card-avatar>schedule</mat-icon>
              <mat-card-title>Gestionar Horarios</mat-card-title>
              <mat-card-subtitle>Crear y asignar horarios de clases</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>🚧 <em>En desarrollo</em> - Crea horarios, asigna profesores y aulas, verifica conflictos.</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button disabled>Próximamente</button>
            </mat-card-actions>
          </mat-card>

          <mat-card class="admin-card disabled" (click)="showComingSoon('Aulas')">
            <mat-card-header>
              <mat-icon mat-card-avatar>meeting_room</mat-icon>
              <mat-card-title>Gestionar Aulas</mat-card-title>
              <mat-card-subtitle>Administrar espacios físicos</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>🚧 <em>En desarrollo</em> - Registra aulas, define capacidades y verifica disponibilidad.</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button disabled>Próximamente</button>
            </mat-card-actions>
          </mat-card>

          <mat-card class="admin-card disabled" (click)="showComingSoon('Alumnos')">
            <mat-card-header>
              <mat-icon mat-card-avatar>school</mat-icon>
              <mat-card-title>Gestionar Alumnos</mat-card-title>
              <mat-card-subtitle>Administrar estudiantes</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>🚧 <em>En desarrollo</em> - Registra alumnos, asigna a grupos y gestiona información académica.</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button disabled>Próximamente</button>
            </mat-card-actions>
          </mat-card>

          <mat-card class="admin-card disabled" (click)="showComingSoon('Profesores')">
            <mat-card-header>
              <mat-icon mat-card-avatar>person</mat-icon>
              <mat-card-title>Gestionar Profesores</mat-card-title>
              <mat-card-subtitle>Administrar docentes</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>🚧 <em>En desarrollo</em> - Registra profesores, asigna materias y gestiona horarios docentes.</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button disabled>Próximamente</button>
            </mat-card-actions>
          </mat-card>

          <mat-card class="admin-card disabled" (click)="showComingSoon('Asistencias')">
            <mat-card-header>
              <mat-icon mat-card-avatar>assignment_turned_in</mat-icon>
              <mat-card-title>Gestionar Asistencias</mat-card-title>
              <mat-card-subtitle>Control de asistencias y reportes</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>🚧 <em>En desarrollo</em> - Controla asistencias, genera reportes y estadísticas.</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-raised-button disabled>Próximamente</button>
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

    .temp-message {
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
    }

    .temp-message mat-card {
      max-width: 600px;
      text-align: center;
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

    .admin-card:not(.disabled):hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .admin-card.disabled {
      opacity: 0.6;
      cursor: not-allowed;
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
  private currentRoute: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.currentRoute = this.router.url;
  }

  navigateTo(section: string): void {
    this.router.navigate(['/admin', section]);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  isTemporaryRoute(): boolean {
    return this.router.url.includes('/admin/horarios') ||
           this.router.url.includes('/admin/aulas') ||
           this.router.url.includes('/admin/alumnos') ||
           this.router.url.includes('/admin/profesores') ||
           this.router.url.includes('/admin/asistencias');
  }

  getSectionName(): string {
    if (this.router.url.includes('horarios')) return 'Gestión de Horarios';
    if (this.router.url.includes('aulas')) return 'Gestión de Aulas';
    if (this.router.url.includes('alumnos')) return 'Gestión de Alumnos';
    if (this.router.url.includes('profesores')) return 'Gestión de Profesores';
    if (this.router.url.includes('asistencias')) return 'Gestión de Asistencias';
    return 'Sección';
  }

  showComingSoon(section: string): void {
    alert(`${section} - Funcionalidad en desarrollo. Por ahora usa "Gestión de Grupos".`);
  }
}