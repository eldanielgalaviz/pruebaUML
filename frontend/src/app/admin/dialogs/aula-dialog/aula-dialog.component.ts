// frontend/src/app/admin/dialogs/aula-dialog/aula-dialog.component.ts
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-aula-dialog',
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar Aula' : 'Nueva Aula' }}</h2>
    
    <mat-dialog-content>
      <form [formGroup]="aulaForm">
        <mat-form-field appearance="outline">
          <mat-label>Número del Aula</mat-label>
          <input matInput formControlName="numero" placeholder="Ej: A101, B205">
          <mat-error *ngIf="aulaForm.get('numero')?.hasError('required')">
            El número del aula es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Capacidad</mat-label>
          <input matInput type="number" formControlName="capacidad" placeholder="Número de personas">
          <mat-error *ngIf="aulaForm.get('capacidad')?.hasError('required')">
            La capacidad es requerida
          </mat-error>
          <mat-error *ngIf="aulaForm.get('capacidad')?.hasError('min')">
            La capacidad debe ser mayor a 0
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Ubicación (Opcional)</mat-label>
          <input matInput formControlName="ubicacion" placeholder="Ej: Edificio A, Planta Baja">
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!aulaForm.valid">
        {{ data ? 'Actualizar' : 'Guardar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-form-field {
      width: 100%;
      margin-bottom: 15px;
    }

    mat-dialog-content {
      min-width: 400px;
      max-height: 70vh;
      overflow-y: auto;
    }

    mat-dialog-actions {
      justify-content: flex-end;
      gap: 10px;
    }
  `]
})
export class AulaDialogComponent implements OnInit {
  aulaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AulaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.aulaForm = this.fb.group({
      numero: ['', Validators.required],
      capacidad: ['', [Validators.required, Validators.min(1)]],
      ubicacion: ['']
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.aulaForm.patchValue({
        numero: this.data.numero,
        capacidad: this.data.capacidad,
        ubicacion: this.data.ubicacion
      });
    }
  }

  onSave(): void {
    if (this.aulaForm.valid) {
      const aulaData = this.aulaForm.value;
      
      const request = this.data ? 
        this.adminService.updateAula(this.data.id, aulaData) :
        this.adminService.createAula(aulaData);

      request.subscribe({
        next: (result) => {
          const mensaje = this.data ? 'Aula actualizada correctamente' : 'Aula creada correctamente';
          this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Error al guardar aula:', error);
          let mensaje = 'Error al guardar aula';
          
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