// frontend/src/app/admin/admin-management/admin-management.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../services/admin.service';

interface Grupo {
  id: number;
  codigo: string;
  nombre: string;
  grado: string;
  periodo: string;
  alumnos?: any[];
}

interface Horario {
  id: number;
  dia: string;
  horaInicio: string;
  horaFin: string;
  materia: string;
  grupo: any;
  aula: any;
  profesor: any;
}

interface Aula {
  id: number;
  codigo: string;
  nombre: string;
  capacidad: number;
  ubicacion: string;
}

@Component({
  selector: 'app-admin-management',
  template: `
    <div class="admin-container">
      <mat-toolbar color="primary">
        <span>Panel de Administración</span>
      </mat-toolbar>

      <mat-tab-group>
        <!-- TAB 1: GESTIÓN DE GRUPOS -->
        <mat-tab label="Grupos">
          <div class="tab-content">
            <div class="actions-bar">
              <button mat-raised-button color="primary" (click)="openGrupoDialog()">
                <mat-icon>add</mat-icon>
                Nuevo Grupo
              </button>
            </div>

            <mat-table [dataSource]="grupos" class="mat-elevation-z2">
              <ng-container matColumnDef="codigo">
                <mat-header-cell *matHeaderCellDef>Código</mat-header-cell>
                <mat-cell *matCellDef="let grupo">{{ grupo.codigo }}</mat-cell>
              </ng-container>

              <ng-container matColumnDef="nombre">
                <mat-header-cell *matHeaderCellDef>Nombre</mat-header-cell>
                <mat-cell *matCellDef="let grupo">{{ grupo.nombre }}</mat-cell>
              </ng-container>

              <ng-container matColumnDef="grado">
                <mat-header-cell *matHeaderCellDef>Grado</mat-header-cell>
                <mat-cell *matCellDef="let grupo">{{ grupo.grado }}</mat-cell>
              </ng-container>

              <ng-container matColumnDef="alumnos">
                <mat-header-cell *matHeaderCellDef>Alumnos</mat-header-cell>
                <mat-cell *matCellDef="let grupo">{{ grupo.alumnos?.length || 0 }}</mat-cell>
              </ng-container>

              <ng-container matColumnDef="acciones">
                <mat-header-cell *matHeaderCellDef>Acciones</mat-header-cell>
                <mat-cell *matCellDef="let grupo">
                  <button mat-icon-button (click)="editGrupo(grupo)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button (click)="asignarAlumnos(grupo)">
                    <mat-icon>group_add</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteGrupo(grupo.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </mat-cell>
              </ng-container>

              <mat-header-row *matHeaderRowDef="displayedColumnsGrupos"></mat-header-row>
              <mat-row *matRowDef="let row; columns: displayedColumnsGrupos;"></mat-row>
            </mat-table>
          </div>
        </mat-tab>

        <!-- TAB 2: GESTIÓN DE HORARIOS -->
        <mat-tab label="Horarios">
          <div class="tab-content">
            <div class="actions-bar">
              <button mat-raised-button color="primary" (click)="openHorarioDialog()">
                <mat-icon>add</mat-icon>
                Nuevo Horario
              </button>
              <button mat-raised-button color="accent" (click)="verConflictos()">
                <mat-icon>warning</mat-icon>
                Ver Conflictos
              </button>
            </div>

            <mat-table [dataSource]="horarios" class="mat-elevation-z2">
              <ng-container matColumnDef="dia">
                <mat-header-cell *matHeaderCellDef>Día</mat-header-cell>
                <mat-cell *matCellDef="let horario">{{ horario.dia | titlecase }}</mat-cell>
              </ng-container>

              <ng-container matColumnDef="hora">
                <mat-header-cell *matHeaderCellDef>Hora</mat-header-cell>
                <mat-cell *matCellDef="let horario">{{ horario.horaInicio }} - {{ horario.horaFin }}</mat-cell>
              </ng-container>

              <ng-container matColumnDef="materia">
                <mat-header-cell *matHeaderCellDef>Materia</mat-header-cell>
                <mat-cell *matCellDef="let horario">{{ horario.materia }}</mat-cell>
              </ng-container>

              <ng-container matColumnDef="grupo">
                <mat-header-cell *matHeaderCellDef>Grupo</mat-header-cell>
                <mat-cell *matCellDef="let horario">{{ horario.grupo?.nombre }}</mat-cell>
              </ng-container>

              <ng-container matColumnDef="profesor">
                <mat-header-cell *matHeaderCellDef>Profesor</mat-header-cell>
                <mat-cell *matCellDef="let horario">{{ horario.profesor?.usuario?.nombre }}</mat-cell>
              </ng-container>

              <ng-container matColumnDef="aula">
                <mat-header-cell *matHeaderCellDef>Aula</mat-header-cell>
                <mat-cell *matCellDef="let horario">{{ horario.aula?.codigo }}</mat-cell>
              </ng-container>

              <ng-container matColumnDef="acciones">
                <mat-header-cell *matHeaderCellDef>Acciones</mat-header-cell>
                <mat-cell *matCellDef="let horario">
                  <button mat-icon-button (click)="editHorario(horario)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteHorario(horario.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </mat-cell>
              </ng-container>

              <mat-header-row *matHeaderRowDef="displayedColumnsHorarios"></mat-header-row>
              <mat-row *matRowDef="let row; columns: displayedColumnsHorarios;"></mat-row>
            </mat-table>
          </div>
        </mat-tab>

        <!-- TAB 3: GESTIÓN DE AULAS -->
        <mat-tab label="Aulas">
          <div class="tab-content">
            <div class="actions-bar">
              <button mat-raised-button color="primary" (click)="openAulaDialog()">
                <mat-icon>add</mat-icon>
                Nueva Aula
              </button>
            </div>

            <mat-table [dataSource]="aulas" class="mat-elevation-z2">
              <ng-container matColumnDef="codigo">
                <mat-header-cell *matHeaderCellDef>Código</mat-header-cell>
                <mat-cell *matCellDef="let aula">{{ aula.codigo }}</mat-cell>
              </ng-container>

              <ng-container matColumnDef="nombre">
                <mat-header-cell *matHeaderCellDef>Nombre</mat-header-cell>
                <mat-cell *matCellDef="let aula">{{ aula.nombre }}</mat-cell>
              </ng-container>

              <ng-container matColumnDef="capacidad">
                <mat-header-cell *matHeaderCellDef>Capacidad</mat-header-cell>
                <mat-cell *matCellDef="let aula">{{ aula.capacidad }}</mat-cell>
              </ng-container>

              <ng-container matColumnDef="ubicacion">
                <mat-header-cell *matHeaderCellDef>Ubicación</mat-header-cell>
                <mat-cell *matCellDef="let aula">{{ aula.ubicacion }}</mat-cell>
              </ng-container>

              <ng-container matColumnDef="acciones">
                <mat-header-cell *matHeaderCellDef>Acciones</mat-header-cell>
                <mat-cell *matCellDef="let aula">
                  <button mat-icon-button (click)="editAula(aula)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button (click)="verOcupacionAula(aula)">
                    <mat-icon>schedule</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteAula(aula.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </mat-cell>
              </ng-container>

              <mat-header-row *matHeaderRowDef="displayedColumnsAulas"></mat-header-row>
              <mat-row *matRowDef="let row; columns: displayedColumnsAulas;"></mat-row>
            </mat-table>
          </div>
        </mat-tab>

        <!-- TAB 4: ASIGNACIONES -->
        <mat-tab label="Asignaciones">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Asignar Alumno a Grupo</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <form [formGroup]="asignacionForm" (ngSubmit)="asignarAlumnoAGrupo()">
                  <mat-form-field appearance="outline">
                    <mat-label>Seleccionar Alumno</mat-label>
                    <mat-select formControlName="alumnoId">
                      <mat-option *ngFor="let alumno of alumnosSinGrupo" [value]="alumno.id">
                        {{ alumno.matricula }} - {{ alumno.usuario?.nombre }} {{ alumno.usuario?.apellidoPaterno }}
                      </mat-option>
                    </mat-select>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Seleccionar Grupo</mat-label>
                    <mat-select formControlName="grupoId">
                      <mat-option *ngFor="let grupo of grupos" [value]="grupo.id">
                        {{ grupo.codigo }} - {{ grupo.nombre }}
                      </mat-option>
                    </mat-select>
                  </mat-form-field>

                  <div class="form-actions">
                    <button mat-raised-button color="primary" type="submit" [disabled]="!asignacionForm.valid">
                      Asignar
                    </button>
                  </div>
                </form>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .admin-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .tab-content {
      padding: 20px;
    }

    .actions-bar {
      margin-bottom: 20px;
      display: flex;
      gap: 10px;
    }

    mat-table {
      width: 100%;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 15px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }

    mat-tab-group {
      flex: 1;
    }
  `]
})
export class AdminManagementComponent implements OnInit {
  grupos: Grupo[] = [];
  horarios: Horario[] = [];
  aulas: Aula[] = [];
  alumnosSinGrupo: any[] = [];

  displayedColumnsGrupos = ['codigo', 'nombre', 'grado', 'alumnos', 'acciones'];
  displayedColumnsHorarios = ['dia', 'hora', 'materia', 'grupo', 'profesor', 'aula', 'acciones'];
  displayedColumnsAulas = ['codigo', 'nombre', 'capacidad', 'ubicacion', 'acciones'];

  asignacionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.asignacionForm = this.fb.group({
      alumnoId: ['', Validators.required],
      grupoId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loadGrupos();
    this.loadHorarios();
    this.loadAulas();
    this.loadAlumnosSinGrupo();
  }

  loadGrupos(): void {
    this.adminService.getGrupos().subscribe({
      next: (grupos) => {
        this.grupos = grupos;
      },
      error: (error) => {
        this.showMessage('Error al cargar grupos');
        console.error(error);
      }
    });
  }

  loadHorarios(): void {
    this.adminService.getHorarios().subscribe({
      next: (horarios) => {
        this.horarios = horarios;
      },
      error: (error) => {
        this.showMessage('Error al cargar horarios');
        console.error(error);
      }
    });
  }

  loadAulas(): void {
    this.adminService.getAulas().subscribe({
      next: (aulas) => {
        this.aulas = aulas;
      },
      error: (error) => {
        this.showMessage('Error al cargar aulas');
        console.error(error);
      }
    });
  }

  loadAlumnosSinGrupo(): void {
    this.adminService.getAlumnosSinGrupo().subscribe({
      next: (alumnos) => {
        this.alumnosSinGrupo = alumnos;
      },
      error: (error) => {
        this.showMessage('Error al cargar alumnos');
        console.error(error);
      }
    });
  }

  // MÉTODOS PARA GRUPOS
  openGrupoDialog(): void {
    // Implementar dialog para crear grupo
    console.log('Abrir dialog de grupo');
  }

  editGrupo(grupo: Grupo): void {
    console.log('Editar grupo:', grupo);
  }

  asignarAlumnos(grupo: Grupo): void {
    console.log('Asignar alumnos a grupo:', grupo);
  }

  deleteGrupo(id: number): void {
    if (confirm('¿Está seguro de eliminar este grupo?')) {
      this.adminService.deleteGrupo(id).subscribe({
        next: () => {
          this.showMessage('Grupo eliminado correctamente');
          this.loadGrupos();
        },
        error: (error) => {
          this.showMessage('Error al eliminar grupo');
          console.error(error);
        }
      });
    }
  }

  // MÉTODOS PARA HORARIOS
  openHorarioDialog(): void {
    console.log('Abrir dialog de horario');
  }

  editHorario(horario: Horario): void {
    console.log('Editar horario:', horario);
  }

  deleteHorario(id: number): void {
    if (confirm('¿Está seguro de eliminar este horario?')) {
      this.adminService.deleteHorario(id).subscribe({
        next: () => {
          this.showMessage('Horario eliminado correctamente');
          this.loadHorarios();
        },
        error: (error) => {
          this.showMessage('Error al eliminar horario');
          console.error(error);
        }
      });
    }
  }

  verConflictos(): void {
    console.log('Ver conflictos de horarios');
  }

  // MÉTODOS PARA AULAS
  openAulaDialog(): void {
    console.log('Abrir dialog de aula');
  }

  editAula(aula: Aula): void {
    console.log('Editar aula:', aula);
  }

  verOcupacionAula(aula: Aula): void {
    console.log('Ver ocupación de aula:', aula);
  }

  deleteAula(id: number): void {
    if (confirm('¿Está seguro de eliminar esta aula?')) {
      this.adminService.deleteAula(id).subscribe({
        next: () => {
          this.showMessage('Aula eliminada correctamente');
          this.loadAulas();
        },
        error: (error) => {
          this.showMessage('Error al eliminar aula');
          console.error(error);
        }
      });
    }
  }

  // ASIGNACIONES
  asignarAlumnoAGrupo(): void {
    if (this.asignacionForm.valid) {
      const { alumnoId, grupoId } = this.asignacionForm.value;
      
      this.adminService.asignarAlumnoAGrupo(grupoId, alumnoId).subscribe({
        next: () => {
          this.showMessage('Alumno asignado correctamente');
          this.asignacionForm.reset();
          this.loadData();
        },
        error: (error) => {
          this.showMessage('Error al asignar alumno');
          console.error(error);
        }
      });
    }
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000
    });
  }
}