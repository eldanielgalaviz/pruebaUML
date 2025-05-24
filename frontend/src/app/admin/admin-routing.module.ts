import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { GruposManagementComponent } from './components/grupos-management/grupos-management.component';

const routes: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'panel', component: AdminDashboardComponent },
  { path: 'grupos', component: GruposManagementComponent },
  
  // ✅ Agregar estas rutas cuando crees los componentes
  // { path: 'horarios', component: HorariosManagementComponent },
  // { path: 'aulas', component: AulasManagementComponent },
  // { path: 'alumnos', component: AlumnosManagementComponent },
  // { path: 'profesores', component: ProfesoresManagementComponent },
  // { path: 'asistencias', component: AsistenciasManagementComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }