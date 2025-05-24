// frontend/src/app/admin/admin.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Material Design Modules
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

import { AdminRoutingModule } from './admin-routing.module';

// Solo componentes que existen
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { GruposManagementComponent } from './components/grupos-management/grupos-management.component';
import { GrupoDialogComponent } from './dialogs/grupo-dialog/grupo-dialog.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    GruposManagementComponent,
    GrupoDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
    AdminRoutingModule
  ]
})
export class AdminModule { }