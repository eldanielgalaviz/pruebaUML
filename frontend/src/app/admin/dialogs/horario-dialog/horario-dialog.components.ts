// frontend/src/app/admin/dialogs/horario-dialog/horario-dialog.component.ts
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-horario-dialog',
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar Horario' : 'Nuevo Horario' }}</h2>
    
    <mat-dialog-content>
      <form [formGroup]="horarioForm">
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Día de la semana</mat-label>
            <mat-select formControlName="dia">
              <mat-option value="lunes">Lunes</mat-option>
              <mat-option value="martes">Martes</mat-option>
              <mat-option value="miercoles">Miércoles</mat-option>
              <mat-option value="jueves">Jueves</mat-option>
              <mat-option value="viernes">Viernes</mat-option>
              <mat-option value="sabado">Sábado</mat-option>
            </mat-select>
            <mat-error *ngIf="horarioForm.get('dia')?.hasError('required')">
              El día es requerido
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Hora de inicio</mat-label>
            <input matInput type="time" formControlName="horaInicio">
            <mat-error *ngIf="horarioForm.get('horaInicio')?.hasError('required')">
              La hora de inicio es requerida
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Hora de fin</mat-label>
            <input matInput type="time" formControlName="horaFin">
            <mat-error *ngIf="horarioForm.get('horaFin')?.hasError('required')">
              La hora de fin es requerida
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Materia</mat-label>
            <input matInput formControlName="materia" placeholder="Nombre de la materia">
            <mat-error *ngIf="horarioForm.get('materia')?.hasError('required')">
              La materia es requerida
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Grupo</mat-label>
            <mat-select formControlName="grupoId">
              <mat-option *ngFor="let grupo of grupos" [value]="grupo.id">
                {{ grupo.codigo }} - {{ grupo.nombre }}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="horarioForm.get('grupoId')?.hasError('required')">
              El grupo es requerido
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Profesor</mat-label>
            <mat-select formControlName="profesorId">
              <mat-option *ngFor="let profesor of profesores" [value]="profesor.id">
                {{ profesor.usuario?.nombre }} {{ profesor.usuario?.apellidoPaterno }}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="horarioForm.get('profesorId')?.hasError('required')">
              El profesor es requerido
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Aula</mat-label>
            <mat-select formControlName="aulaId">
              <mat-option *ngFor="let aula of aulas" [value]="aula.id">
                {{ aula.numero }} (Capacidad: {{ aula.capacidad }})
              </mat-option>
            </mat-select>
            <mat-error *ngIf="horarioForm.get('aulaId')?.hasError('required')">
              El aula es requerida
            </mat-error>
          </mat-form-field>
        </div>

        <!-- Mostrar conflictos si los hay -->
        <div *ngIf="conflictos.length > 0" class="conflictos-warning">
          <mat-icon color="warn">warning</mat-icon>
          <span>¡Atención! Se detectaron conflictos:</span>
          <ul>
            <li *ngFor="let conflicto of conflictos">
              {{ conflicto.profesor?.usuario?.nombre }} ya tiene {{ conflicto.materia }} 
              en {{ conflicto.aula?.numero }} a la misma hora
            </li>
          </ul>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-button (click)="checkConflictos()" [disabled]="!canCheckConflicts()">
        Verificar Conflictos
      </button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!horarioForm.valid || conflictos.length > 0">
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

    .conflictos-warning {
      background-color: #fff3cd;
      border: 1px solid #ffeaa7;
      border-radius: 4px;
      padding: 15px;
      margin: 15px 0;
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }

    .conflictos-warning mat-icon {
      margin-top: 2px;
    }

    .conflictos-warning ul {
      margin: 5px 0 0 0;
      padding-left: 20px;
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
export class HorarioDialogComponent implements OnInit {
  horarioForm: FormGroup;
  grupos: any[] = [];
  profesores: any[] = [];
  aulas: any[] = [];
  conflictos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<HorarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.horarioForm = this.fb.group({
      dia: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      materia: ['', Validators.required],
      grupoId: ['', Validators.required],
      profesorId: ['', Validators.required],
      aulaId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadData();
    
    // Si estamos editando, cargar los datos
    if (this.data) {
      this.horarioForm.patchValue({
        dia: this.data.dia,
        horaInicio: this.data.horaInicio,
        horaFin: this.data.horaFin,
        materia: this.data.materia,
        grupoId: this.data.grupoId,
        profesorId: this.data.profesorId,
        aulaId: this.data.aulaId
      });
    }
  }

  loadData(): void {
    // Cargar grupos
    this.adminService.getGrupos().subscribe({
      next: (grupos) => this.grupos = grupos,
      error: (error) => console.error('Error al cargar grupos:', error)
    });

    // Cargar profesores
    this.adminService.getProfesores().subscribe({
      next: (profesores) => this.profesores = profesores,
      error: (error) => console.error('Error al cargar profesores:', error)
    });

    // Cargar aulas
    this.adminService.getAulas().subscribe({
      next: (aulas) => this.aulas = aulas,
      error: (error) => console.error('Error al cargar aulas:', error)
    });
  }

  canCheckConflicts(): boolean {
    const form = this.horarioForm;
    return form.get('dia')?.valid && 
           form.get('horaInicio')?.valid && 
           form.get('horaFin')?.valid;
  }

  checkConflictos(): void {
    if (!this.canCheckConflicts()) {
      return;
    }

    const { dia, horaInicio, horaFin } = this.horarioForm.value;
    
    this.adminService.checkConflictosHorario(dia, horaInicio, horaFin).subscribe({
      next: (conflictos) => {
        this.conflictos = conflictos;
        if (conflictos.length === 0) {
          this.snackBar.open('No se detectaron conflictos', 'Cerrar', { duration: 2000 });
        }
      },
      error: (error) => {
        console.error('Error al verificar conflictos:', error);
        this.snackBar.open('Error al verificar conflictos', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onSave(): void {
    if (this.horarioForm.valid && this.conflictos.length === 0) {
      const horarioData = this.horarioForm.value;
      
      const request = this.data ? 
        this.adminService.updateHorario(this.data.id, horarioData) :
        this.adminService.createHorario(horarioData);

      request.subscribe({
        next: (result) => {
          const mensaje = this.data ? 'Horario actualizado correctamente' : 'Horario creado correctamente';
          this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Error al guardar horario:', error);
          let mensaje = 'Error al guardar horario';
          
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