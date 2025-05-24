import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// ✅ TODAS las importaciones de Angular Material necesarias
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
import { MatChipsModule } from '@angular/material/chips';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { AdminRoutingModule } from './admin-routing.module';

// Componentes principales
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { GruposManagementComponent } from './components/grupos-management/grupos-management.component';

// Diálogos principales
import { GrupoDialogComponent } from './dialogs/grupo-dialog/grupo-dialog.component';

// ✅ CREAR SOLO LOS COMPONENTES QUE EXISTEN
// Comentar los que no existen aún para evitar errores
// import { HorariosManagementComponent } from './components/horarios-management/horarios-management.component';
// import { AulasManagementComponent } from './components/aulas-management/aulas-management.component';
// import { AlumnosManagementComponent } from './components/alumnos-management/alumnos-management.component';
// import { ProfesoresManagementComponent } from './components/profesores-management/profesores-management.component';
// import { AsistenciasManagementComponent } from './components/asistencias-management/asistencias-management.component';

@NgModule({
  declarations: [
    // ✅ Solo componentes que existen
    AdminDashboardComponent,
    GruposManagementComponent,
    GrupoDialogComponent,
    
    // ✅ Agregar otros cuando los crees
    // HorariosManagementComponent,
    // AulasManagementComponent,
    // AlumnosManagementComponent,
    // ProfesoresManagementComponent,
    // AsistenciasManagementComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    
    // ✅ Todos los módulos de Material
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
    MatChipsModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    
    AdminRoutingModule
  ]
})
export class AdminModule { }