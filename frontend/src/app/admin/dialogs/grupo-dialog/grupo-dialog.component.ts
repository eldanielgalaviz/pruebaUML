// frontend/src/app/admin/dialogs/grupo-dialog/grupo-dialog.component.ts
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-grupo-dialog',
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar Grupo' : 'Nuevo Grupo' }}</h2>
    
    <mat-dialog-content>
      <form [formGroup]="grupoForm">
        <mat-form-field appearance="outline">
          <mat-label>Código del Grupo</mat-label>
          <input matInput formControlName="codigo" placeholder="Ej: 6A, 1B">
          <mat-error *ngIf="grupoForm.get('codigo')?.hasError('required')">
            El código es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Nombre del Grupo</mat-label>
          <input matInput formControlName="nombre" placeholder="Ej: Sexto A, Primero B">
          <mat-error *ngIf="grupoForm.get('nombre')?.hasError('required')">
            El nombre es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Grado</mat-label>
          <mat-select formControlName="grado">
            <mat-option value="1°">1° (Primero)</mat-option>
            <mat-option value="2°">2° (Segundo)</mat-option>
            <mat-option value="3°">3° (Tercero)</mat-option>
            <mat-option value="4°">4° (Cuarto)</mat-option>
            <mat-option value="5°">5° (Quinto)</mat-option>
            <mat-option value="6°">6° (Sexto)</mat-option>
          </mat-select>
          <mat-error *ngIf="grupoForm.get('grado')?.hasError('required')">
            El grado es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Período</mat-label>
          <input matInput formControlName="periodo" placeholder="Ej: 2024-1, 2024-2">
          <mat-error *ngIf="grupoForm.get('periodo')?.hasError('required')">
            El período es requerido
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Descripción (Opcional)</mat-label>
          <textarea matInput formControlName="descripcion" rows="3" 
                    placeholder="Descripción adicional del grupo"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!grupoForm.valid">
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
export class GrupoDialogComponent implements OnInit {
  grupoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<GrupoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.grupoForm = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      grado: ['', Validators.required],
      periodo: ['', Validators.required],
      descripcion: ['']
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.grupoForm.patchValue({
        codigo: this.data.codigo,
        nombre: this.data.nombre,
        grado: this.data.grado,
        periodo: this.data.periodo,
        descripcion: this.data.descripcion
      });
    }
  }

  onSave(): void {
    if (this.grupoForm.valid) {
      const grupoData = this.grupoForm.value;
      
      const request = this.data ? 
        this.adminService.updateGrupo(this.data.id, grupoData) :
        this.adminService.createGrupo(grupoData);

      request.subscribe({
        next: (result) => {
          const mensaje = this.data ? 'Grupo actualizado correctamente' : 'Grupo creado correctamente';
          this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Error al guardar grupo:', error);
          let mensaje = 'Error al guardar grupo';
          
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