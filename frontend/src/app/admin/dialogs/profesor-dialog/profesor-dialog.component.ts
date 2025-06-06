// frontend/src/app/admin/dialogs/profesor-dialog/profesor-dialog.component.ts
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-profesor-dialog',
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar Profesor' : 'Nuevo Profesor' }}</h2>
    
    <mat-dialog-content>
      <form [formGroup]="profesorForm">
        <!-- Información básica del usuario -->
        <div class="section-title">Información Personal</div>
        
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Nombre de Usuario</mat-label>
            <input matInput formControlName="username" placeholder="Nombre de usuario único">
            <mat-error *ngIf="profesorForm.get('username')?.hasError('required')">
              El nombre de usuario es requerido
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" placeholder="correo@ejemplo.com">
            <mat-error *ngIf="profesorForm.get('email')?.hasError('required')">
              El email es requerido
            </mat-error>
            <mat-error *ngIf="profesorForm.get('email')?.hasError('email')">
              Ingrese un email válido
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Nombre</mat-label>
            <input matInput formControlName="nombre" placeholder="Nombre(s)">
            <mat-error *ngIf="profesorForm.get('nombre')?.hasError('required')">
              El nombre es requerido
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Apellido Paterno</mat-label>
            <input matInput formControlName="apellidoPaterno" placeholder="Apellido paterno">
            <mat-error *ngIf="profesorForm.get('apellidoPaterno')?.hasError('required')">
              El apellido paterno es requerido
            </mat-error>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Apellido Materno</mat-label>
            <input matInput formControlName="apellidoMaterno" placeholder="Apellido materno">
            <mat-error *ngIf="profesorForm.get('apellidoMaterno')?.hasError('required')">
              El apellido materno es requerido
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Fecha de Nacimiento</mat-label>
            <input matInput type="date" formControlName="fechaNacimiento">
            <mat-error *ngIf="profesorForm.get('fechaNacimiento')?.hasError('required')">
              La fecha de nacimiento es requerida
            </mat-error>
          </mat-form-field>
        </div>

        <!-- Información específica del profesor -->
        <div class="section-title">Información Académica</div>

        <mat-form-field appearance="outline">
          <mat-label>ID del Profesor</mat-label>
          <input matInput formControlName="idProfesor" placeholder="Ej: PROF001">
          <mat-error *ngIf="profesorForm.get('idProfesor')?.hasError('required')">
            El ID del profesor es requerido
          </mat-error>
        </mat-form-field>

        <!-- Contraseñas (solo para nuevo profesor) -->
        <div *ngIf="!data" class="section-title">Credenciales de Acceso</div>
        
        <div *ngIf="!data" class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>Contraseña</mat-label>
            <input matInput type="password" formControlName="password" placeholder="Mínimo 6 caracteres">
            <mat-error *ngIf="profesorForm.get('password')?.hasError('required')">
              La contraseña es requerida
            </mat-error>
            <mat-error *ngIf="profesorForm.get('password')?.hasError('minlength')">
              La contraseña debe tener al menos 6 caracteres
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Confirmar Contraseña</mat-label>
            <input matInput type="password" formControlName="confirmPassword" placeholder="Repetir contraseña">
            <mat-error *ngIf="profesorForm.get('confirmPassword')?.hasError('required')">
              Debe confirmar la contraseña
            </mat-error>
            <mat-error *ngIf="profesorForm.get('confirmPassword')?.hasError('passwordMismatch')">
              Las contraseñas no coinciden
            </mat-error>
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!profesorForm.valid">
        {{ data ? 'Actualizar' : 'Crear Profesor' }}
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
export class ProfesorDialogComponent implements OnInit {
  profesorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ProfesorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.profesorForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      idProfesor: ['', Validators.required],
      password: [''],
      confirmPassword: ['']
    });

    // Solo requerir contraseñas para nuevos profesores
    if (!this.data) {
      this.profesorForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.profesorForm.get('confirmPassword')?.setValidators([Validators.required]);
    }

    // Validador personalizado para contraseñas coincidentes
    this.profesorForm.setValidators(this.passwordMatchValidator);
  }

  ngOnInit(): void {
    if (this.data) {
      // Editando profesor existente
      this.profesorForm.patchValue({
        username: this.data.usuario?.username,
        email: this.data.usuario?.email,
        nombre: this.data.usuario?.nombre,
        apellidoPaterno: this.data.usuario?.apellidoPaterno,
        apellidoMaterno: this.data.usuario?.apellidoMaterno,
        fechaNacimiento: this.data.usuario?.fechaNacimiento,
        idProfesor: this.data.idProfesor
      });
    }
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
    if (this.profesorForm.valid) {
      const profesorData = this.profesorForm.value;
      
      const request = this.data ? 
        this.adminService.updateProfesor(this.data.id, profesorData) :
        this.adminService.createProfesor(profesorData);

      request.subscribe({
        next: (result) => {
          const mensaje = this.data ? 'Profesor actualizado correctamente' : 'Profesor creado correctamente';
          this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Error al guardar profesor:', error);
          let mensaje = 'Error al guardar profesor';
          
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