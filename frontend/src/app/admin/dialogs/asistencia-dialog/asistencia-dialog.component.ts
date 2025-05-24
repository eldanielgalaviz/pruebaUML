// frontend/src/app/admin/dialogs/asistencia-dialog/asistencia-dialog.component.ts
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-asistencia-dialog',
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar Asistencia' : 'Nueva Asistencia' }}</h2>
    
    <mat-dialog-content>
      <form [formGroup]="asistenciaForm">
        <!-- Fecha -->
        <mat-form-field appearance="outline">
          <mat-label>Fecha</mat-label>
          <input matInput type="date" formControlName="fecha">
          <mat-error *ngIf="asistenciaForm.get('fecha')?.hasError('required')">
            La fecha es requerida
          </mat-error>
        </mat-form-field>

        <!-- Hora -->
        <mat-form-field appearance="outline">
          <mat-label>Hora</mat-label>
          <input matInput type="time" formControlName="hora">
          <mat-error *ngIf="asistenciaForm.get('hora')?.hasError('required')">
            La hora es requerida
          </mat-error>
        </mat-form-field>

        <!-- Profesor -->
        <mat-form-field appearance="outline">
          <mat-label>Profesor</mat-label>
          <mat-select formControlName="profesorId" (selectionChange)="onProfesorChange()">
            <mat-option *ngFor="let profesor of profesores" [value]="profesor.id">
              {{ profesor.usuario?.nombre }} {{ profesor.usuario?.apellidoPaterno }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="asistenciaForm.get('profesorId')?.hasError('required')">
            El profesor es requerido
          </mat-error>
        </mat-form-field>

        <!-- Horario (opcional) -->
        <mat-form-field appearance="outline" *ngIf="horariosDelProfesor.length > 0">
          <mat-label>Horario (Opcional)</mat-label>
          <mat-select formControlName="horarioId">
            <mat-option [value]="null">Sin horario específico</mat-option>
            <mat-option *ngFor="let horario of horariosDelProfesor" [value]="horario.id">
              {{ horario.materia }} - {{ horario.dia | titlecase }} {{ horario.horaInicio }}-{{ horario.horaFin }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <!-- Estado de Asistencia -->
        <div class="field-group">
          <label class="field-label">Estado de Asistencia</label>
          <mat-radio-group formControlName="asistio" class="radio-group">
            <mat-radio-button [value]="true" class="radio-button">
              <mat-icon color="primary">check_circle</mat-icon>
              Presente
            </mat-radio-button>
            <mat-radio-button [value]="false" class="radio-button">
              <mat-icon color="warn">cancel</mat-icon>
              Ausente
            </mat-radio-button>
          </mat-radio-group>
        </div>

        <!-- Observaciones -->
        <mat-form-field appearance="outline">
          <mat-label>Observaciones (Opcional)</mat-label>
          <textarea matInput formControlName="observaciones" rows="3" 
                    placeholder="Observaciones adicionales"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!asistenciaForm.valid">
        {{ data ? 'Actualizar' : 'Guardar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-form-field {
      width: 100%;
      margin-bottom: 15px;
    }

    .field-group {
      margin-bottom: 20px;
    }

    .field-label {
      display: block;
      margin-bottom: 10px;
      font-weight: 500;
      color: rgba(0,0,0,0.6);
    }

    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .radio-button {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    mat-dialog-content {
      min-width: 500px;
      max-height: 70vh;
      overflow-y: auto;
    }

    mat-dialog-actions {
      justify-content: flex-end;
      gap: 10px;
    }
  `]
})
export class AsistenciaDialogComponent implements OnInit {
  asistenciaForm: FormGroup;
  profesores: any[] = [];
  horariosDelProfesor: any[] = [];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AsistenciaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.asistenciaForm = this.fb.group({
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      profesorId: ['', Validators.required],
      horarioId: [null],
      asistio: [true, Validators.required],
      observaciones: ['']
    });
  }

  ngOnInit(): void {
    this.loadProfesores();
    
    // Si estamos editando, cargar los datos
    if (this.data) {
      this.asistenciaForm.patchValue({
        fecha: this.data.fecha,
        hora: this.data.hora,
        profesorId: this.data.profesorId,
        horarioId: this.data.horarioId,
        asistio: this.data.asistio,
        observaciones: this.data.observaciones
      });
      
      if (this.data.profesorId) {
        this.loadHorariosDelProfesor(this.data.profesorId);
      }
    } else {
      // Para nueva asistencia, configurar fecha y hora actuales
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const currentTime = now.toTimeString().slice(0,5);
      
      this.asistenciaForm.patchValue({
        fecha: today,
        hora: currentTime
      });
    }
  }

  loadProfesores(): void {
    this.adminService.getProfesores().subscribe({
      next: (profesores) => {
        this.profesores = profesores;
      },
      error: (error) => {
        console.error('Error al cargar profesores:', error);
        this.showMessage('Error al cargar profesores');
      }
    });
  }

  onProfesorChange(): void {
    const profesorId = this.asistenciaForm.get('profesorId')?.value;
    if (profesorId) {
      this.loadHorariosDelProfesor(profesorId);
      // Limpiar selección de horario
      this.asistenciaForm.patchValue({ horarioId: null });
    } else {
      this.horariosDelProfesor = [];
    }
  }

  loadHorariosDelProfesor(profesorId: number): void {
    // Por ahora simular datos
    this.horariosDelProfesor = [];
    console.log('Cargando horarios para profesor:', profesorId);
  }

  onSave(): void {
    if (this.asistenciaForm.valid) {
      const asistenciaData = this.asistenciaForm.value;
      
      // Por ahora solo mostrar mensaje de desarrollo
      this.showMessage('Funcionalidad en desarrollo');
      console.log('Datos de asistencia:', asistenciaData);
      
      // Simular guardado exitoso
      setTimeout(() => {
        this.dialogRef.close(asistenciaData);
      }, 1000);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }
}