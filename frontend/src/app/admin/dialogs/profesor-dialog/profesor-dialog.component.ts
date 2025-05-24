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
        <div class="form-section">
          <h3>Información Personal</h3>
          
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Nombre de Usuario</mat-label>
              <input matInput formControlName="username" placeholder="Usuario único">
              <mat-error *ngIf="profesorForm.get('username')?.hasError('required')">
                El nombre de usuario es requerido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>ID Profesor</mat-label>
              <input matInput formControlName="idProfesor" placeholder="ID único del profesor">
              <mat-error *ngIf="profesorForm.get('idProfesor')?.hasError('required')">
                El ID del profesor es requerido
              </mat-error>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline">
            <mat-label>Correo Electrónico</mat-label>
            <input matInput type="email" formControlName="email" placeholder="correo@ejemplo.com">
            <mat-error *ngIf="profesorForm.get('email')?.hasError('required')">
              El email es requerido
            </mat-error>
            <mat-error *ngIf="profesorForm.get('email')?.hasError('email')">
              Ingrese un email válido
            </mat-error>
          </mat-form-field>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="nombre">
              <mat-error *ngIf="profesorForm.get('nombre')?.hasError('required')">
                El nombre es requerido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Apellido Paterno</mat-label>
              <input matInput formControlName="apellidoPaterno">
              <mat-error *ngIf="profesorForm.get('apellidoPaterno')?.hasError('required')">
                El apellido paterno es requerido
              </mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Apellido Materno</mat-label>
              <input matInput formControlName="apellidoMaterno">
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
        </div>

        <div class="form-section" *ngIf="!data">
          <h3>Credenciales de Acceso</h3>
          
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Contraseña</mat-label>
              <input matInput type="password" formControlName="password">
              <mat-error *ngIf="profesorForm.get('password')?.hasError('required')">
                La contraseña es requerida
              </mat-error>
              <mat-error *ngIf="profesorForm.get('password')?.hasError('minlength')">
                Mínimo 6 caracteres
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Confirmar Contraseña</mat-label>
              <input matInput type="password" formControlName="confirmPassword">
              <mat-error *ngIf="profesorForm.get('confirmPassword')?.hasError('required')">
                Debe confirmar la contraseña
              </mat-error>
              <mat-error *ngIf="profesorForm.hasError('passwordMismatch')">
                Las contraseñas no coinciden
              </mat-error>
            </mat-form-field>
          </div>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!profesorForm.valid">
        {{ data ? 'Actualizar' : 'Guardar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .form-section {
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #e0e0e0;
    }

    .form-section:last-child {
      border-bottom: none;
    }

    .form-section h3 {
      margin: 0 0 15px 0;
      color: #333;
      font-size: 16px;
    }

    .form-row {
      display: flex;
      gap: 15px;
      margin-bottom: 15px;
    }

    .form-row mat-form-field {
      flex: 1;
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
      idProfesor: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      password: [''],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });

    // Solo requerir contraseñas para nuevos usuarios
    if (!this.data) {
      this.profesorForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.profesorForm.get('confirmPassword')?.setValidators([Validators.required]);
    }
  }

  ngOnInit(): void {
    if (this.data) {
      this.profesorForm.patchValue({
        username: this.data.usuario?.username,
        idProfesor: this.data.idProfesor,
        email: this.data.usuario?.email,
        nombre: this.data.usuario?.nombre,
        apellidoPaterno: this.data.usuario?.apellidoPaterno,
        apellidoMaterno: this.data.usuario?.apellidoMaterno,
        fechaNacimiento: this.data.usuario?.fechaNacimiento
      });
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onSave(): void {
    if (this.profesorForm.valid) {
      const profesorData = this.profesorForm.value;
      
      // Convertir fecha al formato correcto
      if (profesorData.fechaNacimiento) {
        profesorData.fechaNacimiento = new Date(profesorData.fechaNacimiento).toISOString().split('T')[0];
      }
      
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