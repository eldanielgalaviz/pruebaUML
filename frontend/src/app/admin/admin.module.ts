// frontend/src/app/admin/admin.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Material Design Modules - TODOS LOS NECESARIOS
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';

import { AdminRoutingModule } from './admin-routing.module';

// Componentes principales
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { GruposManagementComponent } from './components/grupos-management/grupos-management.component';
import { HorariosManagementComponent } from './components/horarios-management/horarios-management.component';
import { AulasManagementComponent } from './components/aulas-management/aulas-management.component';
import { AlumnosManagementComponent } from './components/alumnos-management/alumnos-management.component';
import { ProfesoresManagementComponent } from './components/profesores-management/profesores-management.component';
import { AsistenciasManagementComponent } from './components/asistencias-management/asistencias-management.component';

// Diálogos
import { GrupoDialogComponent } from './dialogs/grupo-dialog/grupo-dialog.component';
// import { HorarioDialogComponent } from './dialogs/alumno-dialog/alumno-dialog.component';
// import { HorarioDialogComponent } from './dialogs/alumno-dialog/alumno-dialog.component';
import { HorarioDialogComponent } from './dialogs/horario-dialog/horario-dialog.components';
import { AulaDialogComponent } from './dialogs/aula-dialog/aula-dialog.component';
import { AlumnoDialogComponent } from './dialogs/alumno-dialog/alumno-dialog.component';
import { ProfesorDialogComponent } from './dialogs/profesor-dialog/profesor-dialog.component';
import { AsistenciaDialogComponent } from './dialogs/asistencia-dialog/asistencia-dialog.component';
import { AsignacionGrupoDialogComponent } from './dialogs/asignacion-grupo-dialog/asignacion-grupo-dialog.component';

@NgModule({
  declarations: [
    // Componentes principales
    AdminDashboardComponent,
    GruposManagementComponent,
    HorariosManagementComponent,
    AulasManagementComponent,
    AlumnosManagementComponent,
    ProfesoresManagementComponent,
    AsistenciasManagementComponent,
    HorarioDialogComponent,
    
    // Diálogos
    GrupoDialogComponent,
    AulaDialogComponent,
    AlumnoDialogComponent,
    ProfesorDialogComponent,
    AsistenciaDialogComponent,
    AsignacionGrupoDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule, // Para ngModel
    
    // Material Modules
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatCardModule,
    MatTabsModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatRadioModule,
    MatChipsModule,
    
    AdminRoutingModule
  ]
})
export class AdminModule { }