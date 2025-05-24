// frontend/src/app/admin/admin-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { GruposManagementComponent } from './components/grupos-management/grupos-management.component';
import { HorariosManagementComponent } from './components/horarios-management/horarios-management.component';
import { AulasManagementComponent } from './components/aulas-management/aulas-management.component';
import { AlumnosManagementComponent } from './components/alumnos-management/alumnos-management.component';
import { ProfesoresManagementComponent } from './components/profesores-management/profesores-management.component';
import { AsistenciasManagementComponent } from './components/asistencias-management/asistencias-management.component';

const routes: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'panel', component: AdminDashboardComponent },
  { path: 'grupos', component: GruposManagementComponent },
  { path: 'horarios', component: HorariosManagementComponent },
  { path: 'aulas', component: AulasManagementComponent },
  { path: 'alumnos', component: AlumnosManagementComponent },
  { path: 'profesores', component: ProfesoresManagementComponent },
  { path: 'asistencias', component: AsistenciasManagementComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }