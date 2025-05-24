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

// Componentes que EXISTEN
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { GruposManagementComponent } from './components/grupos-management/grupos-management.component';
import { GrupoDialogComponent } from './dialogs/grupo-dialog/grupo-dialog.component';

// Componentes que FALTAN - los vamos a crear
import { HorariosManagementComponent } from './components/horarios-management/horarios-management.component';
import { AulasManagementComponent } from './components/aulas-management/aulas-management.component';
import { AlumnosManagementComponent } from './components/alumnos-management/alumnos-management.component';
import { ProfesoresManagementComponent } from './components/profesores-management/profesores-management.component';
import { AsistenciasManagementComponent } from './components/asistencias-management/asistencias-management.component';
import { AsistenciaDialogComponent } from './dialogs/asistencia-dialog/asistencia-dialog.component';

@NgModule({
  declarations: [
    // Componentes existentes
    AdminDashboardComponent,
    GruposManagementComponent,
    GrupoDialogComponent,
    
    // Componentes que faltaban
    HorariosManagementComponent,
    AulasManagementComponent,
    AlumnosManagementComponent,
    ProfesoresManagementComponent,
    AsistenciasManagementComponent,
    AsistenciaDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule, // AÑADIDO para ngModel
    
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
    MatRadioModule, // AÑADIDO para mat-radio-group
    MatChipsModule, // AÑADIDO para mat-chip
    
    AdminRoutingModule
  ]
})
export class AdminModule { }