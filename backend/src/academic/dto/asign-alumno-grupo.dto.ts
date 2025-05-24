import { IsNumber } from 'class-validator';

export class AsignAlumnoGrupoDto {
  @IsNumber()
  alumnoId: number;
}