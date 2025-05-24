// frontend/src/app/admin/dialogs/alumno-dialog/alumno-dialog.component.ts
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-alumno-dialog',
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar Alumno' : 'Nuevo Alumno' }}</h2>
    
    <mat-dialog-content>
      <form [formGroup]="alumnoForm">
        <!-- Información básica del usuario -->
        <div class="section-title">Información Personal</div>
        
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Nombre de Usuario</mat-label>
            <input matInput formControlName="username" placeholder="Nombre de usuario único">
            <mat-error *ngIf="alumnoForm.get('username')?.hasError('required')">
              El nombre de usuario es requerido
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" placeholder="correo@ejemplo.com">
            <mat-error *ngIf="alumnoForm.get('email')?.hasError('required')">
              El email es requerido
            </mat-error>
            <mat-error *ngIf="alumnoForm.get('email')?.hasError('email')">
              Ingrese un email válido
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Nombre</mat-label>
            <input matInput formControlName="nombre" placeholder="Nombre(s)">
            <mat-error *ngIf="alumnoForm.get('nombre')?.hasError('required')">
              El nombre es requerido
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Apellido Paterno</mat-label>
            <input matInput formControlName="apellidoPaterno" placeholder="Apellido paterno">
            <mat-error *ngIf="alumnoForm.get('apellidoPaterno')?.hasError('required')">
              El apellido paterno es requerido
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Apellido Materno</mat-label>
            <input matInput formControlName="apellidoMaterno" placeholder="Apellido materno">
            <mat-error *ngIf="alumnoForm.get('apellidoMaterno')?.hasError('required')">
              El apellido materno es requerido
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Fecha de Nacimiento</mat-label>
            <input matInput type="date" formControlName="fechaNacimiento">
            <mat-error *ngIf="alumnoForm.get('fechaNacimiento')?.hasError('required')">
              La fecha de nacimiento es requerida
            </mat-error>
          </mat-form-field>
        </div>

        <!-- Información específica del alumno -->
        <div class="section-title">Información Académica</div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Matrícula</mat-label>
            <input matInput formControlName="matricula" placeholder="Ej: 2024001">
            <mat-error *ngIf="alumnoForm.get('matricula')?.hasError('required')">
              La matrícula es requerida
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Grupo (Opcional)</mat-label>
            <mat-select formControlName="grupoId">
              <mat-option [value]="null">Sin grupo asignado</mat-option>
              <mat-option *ngFor="let grupo of grupos" [value]="grupo.id">
                {{ grupo.codigo }} - {{ grupo.nombre }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <!-- Contraseñas (solo para nuevo alumno) -->
        <div *ngIf="!data" class="section-title">Credenciales de Acceso</div>
        
        <div *ngIf="!data" class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Contraseña</mat-label>
            <input matInput type="password" formControlName="password" placeholder="Mínimo 6 caracteres">
            <mat-error *ngIf="alumnoForm.get('password')?.hasError('required')">
              La contraseña es requerida
            </mat-error>
            <mat-error *ngIf="alumnoForm.get('password')?.hasError('minlength')">
              La contraseña debe tener al menos 6 caracteres
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Confirmar Contraseña</mat-label>
            <input matInput type="password" formControlName="confirmPassword" placeholder="Repetir contraseña">
            <mat-error *ngIf="alumnoForm.get('confirmPassword')?.hasError('required')">
              Debe confirmar la contraseña
            </mat-error>
            <mat-error *ngIf="alumnoForm.get('confirmPassword')?.hasError('passwordMismatch')">
              Las contraseñas no coinciden
            </mat-error>
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!alumnoForm.valid">
        {{ data ? 'Actualizar' : 'Crear Alumno' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .section-title {
      font-weight: 500;
      color: #333;
      margin: 20px 0 10px 0;
      border-bottom: 1px solid #ddd;
      padding-bottom: 5px;
    }

    .form-row {
      display: flex;
      gap: 15px;
      margin-bottom: 10px;
    }

    .form-row mat-form-field {
      flex: 1;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 15px;
    }

    mat-dialog-content {
      min-width: 600px;
      max-height: 70vh;
      overflow-y: auto;
    }

    mat-dialog-actions {
      justify-content: flex-end;
      gap: 10px;
    }
  `]
})
export class AlumnoDialogComponent implements OnInit {
  alumnoForm: FormGroup;
  grupos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AlumnoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.alumnoForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      matricula: ['', Validators.required],
      grupoId: [null],
      password: [''],
      confirmPassword: ['']
    });

    // Solo requerir contraseñas para nuevos alumnos
    if (!this.data) {
      this.alumnoForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.alumnoForm.get('confirmPassword')?.setValidators([Validators.required]);
    }

    // Validador personalizado para contraseñas coincidentes
    this.alumnoForm.setValidators(this.passwordMatchValidator);
  }

  ngOnInit(): void {
    this.loadGrupos();
    
    if (this.data) {
      // Editando alumno existente
      this.alumnoForm.patchValue({
        username: this.data.usuario?.username,
        email: this.data.usuario?.email,
        nombre: this.data.usuario?.nombre,
        apellidoPaterno: this.data.usuario?.apellidoPaterno,
        apellidoMaterno: this.data.usuario?.apellidoMaterno,
        fechaNacimiento: this.data.usuario?.fechaNacimiento,
        matricula: this.data.matricula,
        grupoId: this.data.grupoId
      });
    }
  }

  loadGrupos(): void {
    this.adminService.getGrupos().subscribe({
      next: (grupos) => {
        this.grupos = grupos;
      },
      error: (error) => {
        console.error('Error al cargar grupos:', error);
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onSave(): void {
    if (this.alumnoForm.valid) {
      const alumnoData = this.alumnoForm.value;
      
      const request = this.data ? 
        this.adminService.updateAlumno(this.data.id, alumnoData) :
        this.adminService.createAlumno(alumnoData);

      request.subscribe({
        next: (result) => {
          const mensaje = this.data ? 'Alumno actualizado correctamente' : 'Alumno creado correctamente';
          this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Error al guardar alumno:', error);
          let mensaje = 'Error al guardar alumno';
          
          if (error.error?.message) {
            if (Array.isArray(error.error.message)) {
              mensaje = error.error.message.join(', ');
            } else {
              mensaje = error.error.message;
            }
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