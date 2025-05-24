import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfesorHorariosComponent } from './profesor-horarios/profesor-horarios.component';

const routes: Routes = [
  { path: 'horarios', component: ProfesorHorariosComponent },
  { path: '', redirectTo: 'horarios', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfesorRoutingModule { }
