import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-asistencia-dialog',
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar Asistencia' : 'Marcar Asistencia' }}</h2>
    
    <mat-dialog-content>
      <form [formGroup]="asistenciaForm">
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Fecha</mat-label>
            <input matInput type="date" formControlName="fecha">
            <mat-error *ngIf="asistenciaForm.get('fecha')?.hasError('required')">
              La fecha es requerida
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Hora</mat-label>
            <input matInput type="time" formControlName="hora">
            <mat-error *ngIf="asistenciaForm.get('hora')?.hasError('required')">
              La hora es requerida
            </mat-error>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Profesor</mat-label>
          <mat-select formControlName="profesorId" (selectionChange)="onProfesorChange()">
            <mat-option *ngFor="let profesor of profesores" [value]="profesor.id">
              {{ profesor.usuario?.nombre }} {{ profesor.usuario?.apellidoPaterno }} - {{ profesor.idProfesor }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="asistenciaForm.get('profesorId')?.hasError('required')">
            El profesor es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" *ngIf="horariosDelProfesor.length > 0">
          <mat-label>Horario (Opcional)</mat-label>
          <mat-select formControlName="horarioId">
            <mat-option [value]="null">Sin horario específico</mat-option>
            <mat-option *ngFor="let horario of horariosDelProfesor" [value]="horario.id">
              {{ horario.materia }} - {{ horario.dia | titlecase }} {{ horario.horaInicio }}-{{ horario.horaFin }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <div class="form-section">
          <h3>Estado de Asistencia</h3>
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

        <mat-form-field appearance="outline">
          <mat-label>Observaciones (Opcional)</mat-label>
          <textarea matInput rows="3" formControlName="observaciones" 
                    placeholder="Notas adicionales sobre la asistencia"></textarea>
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
    .form-row {
      display: flex;
      gap: 15px;
      margin-bottom: 15px;
    }

    .form-row mat-form-field {
      flex: 1;
    }

    .form-section {
      margin: 20px 0;
      padding: 15px;
      background-color: #f9f9f9;
      border-radius: 4px;
    }

    .form-section h3 {
      margin: 0 0 15px 0;
      color: #333;
      font-size: 16px;
    }

    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .radio-button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 15px;
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
      // Valores por defecto para nueva asistencia
      const now = new Date();
      this.asistenciaForm.patchValue({
        fecha: now.toISOString().split('T')[0],
        hora: now.toTimeString().split(' ')[0].substring(0, 5)
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
      }
    });
  }

  onProfesorChange(): void {
    const profesorId = this.asistenciaForm.get('profesorId')?.value;
    if (profesorId) {
      this.loadHorariosDelProfesor(profesorId);
    } else {
      this.horariosDelProfesor = [];
    }
    
    // Limpiar selección de horario cuando cambia el profesor
    this.asistenciaForm.patchValue({ horarioId: null });
  }

  loadHorariosDelProfesor(profesorId: number): void {
    this.adminService.getHorariosByProfesor(profesorId).subscribe({
      next: (horarios) => {
        this.horariosDelProfesor = horarios;
      },
      error: (error) => {
        console.error('Error al cargar horarios del profesor:', error);
        this.horariosDelProfesor = [];
      }
    });
  }

  onSave(): void {
    if (this.asistenciaForm.valid) {
      const asistenciaData = this.asistenciaForm.value;
      
      const request = this.data ? 
        this.adminService.updateAsistencia(this.data.id, asistenciaData) :
        this.adminService.marcarAsistencia(asistenciaData);

      request.subscribe({
        next: (result) => {
          const mensaje = this.data ? 'Asistencia actualizada correctamente' : 'Asistencia marcada correctamente';
          this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Error al guardar asistencia:', error);
          let mensaje = 'Error al guardar asistencia';
          
          if (error.error?.message) {
            mensaje = error.error.message;
          }
          
          this.snackBar.open(mensaje, 'Cerrar', { duration: 5000 });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}