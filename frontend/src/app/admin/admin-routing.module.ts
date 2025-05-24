// frontend/src/app/admin/admin-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { GruposManagementComponent } from './components/grupos-management/grupos-management.component';

const routes: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'panel', component: AdminDashboardComponent },
  { path: 'grupos', component: GruposManagementComponent },
  // Rutas temporales que muestran "en desarrollo"
  { path: 'horarios', component: AdminDashboardComponent },
  { path: 'aulas', component: AdminDashboardComponent },
  { path: 'alumnos', component: AdminDashboardComponent },
  { path: 'profesores', component: AdminDashboardComponent },
  { path: 'asistencias', component: AdminDashboardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }