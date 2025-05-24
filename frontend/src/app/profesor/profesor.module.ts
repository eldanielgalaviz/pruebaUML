import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ProfesorRoutingModule } from './profesor-routing.module';
import { ProfesorHorariosComponent } from './profesor-horarios/profesor-horarios.component';

@NgModule({
  declarations: [
    ProfesorHorariosComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ProfesorRoutingModule
  ]
})
export class ProfesorModule { }