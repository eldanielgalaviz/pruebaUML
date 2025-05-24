import { IsNotEmpty, IsString, IsNumber, IsEnum, Matches } from 'class-validator';
import { DiaSemana } from '../entities/horario.entity';

export class CreateHorarioDto {
  @IsEnum(DiaSemana)
  dia: DiaSemana;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Formato de hora inválido (HH:MM)' })
  horaInicio: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Formato de hora inválido (HH:MM)' })
  horaFin: string;

  @IsNotEmpty()
  @IsString()
  materia: string;

  @IsNumber()
  grupoId: number;

  @IsNumber()
  aulaId: number;

  @IsNumber()
  profesorId: number;
}