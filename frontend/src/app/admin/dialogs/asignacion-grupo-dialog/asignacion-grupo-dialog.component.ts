// frontend/src/app/admin/dialogs/asignacion-grupo-dialog/asignacion-grupo-dialog.component.ts
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-asignacion-grupo-dialog',
  template: `
    <h2 mat-dialog-title>Asignar Alumno a Grupo</h2>
    
    <mat-dialog-content>
      <form [formGroup]="asignacionForm">
        <mat-form-field appearance="outline">
          <mat-label>Seleccionar Alumno</mat-label>
          <mat-select formControlName="alumnoId" [disabled]="data?.alumno">
            <mat-option *ngFor="let alumno of alumnosSinGrupo" [value]="alumno.id">
              {{ alumno.matricula }} - {{ alumno.usuario?.nombre }} {{ alumno.usuario?.apellidoPaterno }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="asignacionForm.get('alumnoId')?.hasError('required')">
            Debe seleccionar un alumno
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Seleccionar Grupo</mat-label>
          <mat-select formControlName="grupoId">
            <mat-option *ngFor="let grupo of grupos" [value]="grupo.id">
              {{ grupo.codigo }} - {{ grupo.nombre }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="asignacionForm.get('grupoId')?.hasError('required')">
            Debe seleccionar un grupo
          </mat-error>
        </mat-form-field>

        <div *ngIf="data?.alumno" class="alumno-info">
          <h4>Alumno Seleccionado:</h4>
          <p><strong>Matrícula:</strong> {{ data.alumno.matricula }}</p>
          <p><strong>Nombre:</strong> {{ data.alumno.usuario?.nombre }} {{ data.alumno.usuario?.apellidoPaterno }}</p>
          <p><strong>Grupo Actual:</strong> 
            <span *ngIf="data.alumno.grupo">{{ data.alumno.grupo.codigo }} - {{ data.alumno.grupo.nombre }}</span>
            <span *ngIf="!data.alumno.grupo" class="sin-grupo">Sin grupo asignado</span>
          </p>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!asignacionForm.valid">
        Asignar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-form-field {
      width: 100%;
      margin-bottom: 15px;
    }

    .alumno-info {
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 4px;
      margin: 15px 0;
    }

    .alumno-info h4 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .alumno-info p {
      margin: 5px 0;
    }

    .sin-grupo {
      color: #f44336;
      font-style: italic;
    }

    mat-dialog-content {
      min-width: 450px;
      max-height: 70vh;
      overflow-y: auto;
    }

    mat-dialog-actions {
      justify-content: flex-end;
      gap: 10px;
    }
  `]
})
export class AsignacionGrupoDialogComponent implements OnInit {
  asignacionForm: FormGroup;
  alumnosSinGrupo: any[] = [];
  grupos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AsignacionGrupoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.asignacionForm = this.fb.group({
      alumnoId: ['', Validators.required],
      grupoId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadData();
    
    // Si se pasó un alumno específico, pre-seleccionarlo
    if (this.data?.alumno) {
      this.asignacionForm.patchValue({
        alumnoId: this.data.alumno.id,
        grupoId: this.data.alumno.grupoId
      });
    }
  }

  loadData(): void {
    // Cargar grupos
    this.adminService.getGrupos().subscribe({
      next: (grupos) => {
        this.grupos = grupos;
      },
      error: (error) => {
        console.error('Error al cargar grupos:', error);
      }
    });

    // Cargar alumnos sin grupo (o todos si se está editando uno específico)
    if (this.data?.alumno) {
      // Si es para un alumno específico, no necesitamos cargar la lista
      this.alumnosSinGrupo = [this.data.alumno];
    } else {
      this.adminService.getAlumnosSinGrupo().subscribe({
        next: (alumnos) => {
          this.alumnosSinGrupo = alumnos;
        },
        error: (error) => {
          console.error('Error al cargar alumnos sin grupo:', error);
        }
      });
    }
  }

  onSave(): void {
    if (this.asignacionForm.valid) {
      const { alumnoId, grupoId } = this.asignacionForm.value;
      
      this.adminService.asignarAlumnoAGrupo(grupoId, alumnoId).subscribe({
        next: (result) => {
          this.snackBar.open('Alumno asignado correctamente al grupo', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Error al asignar alumno:', error);
          let mensaje = 'Error al asignar alumno al grupo';
          
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