import { IsNotEmpty, IsString, IsNumber, Matches } from 'class-validator';

export class CreateHorarioDto {
  @IsNotEmpty()
  @IsString()
  dia: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'La hora debe estar en formato HH:MM'
  })
  horaInicio: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'La hora debe estar en formato HH:MM'
  })
  horaFin: string;

  @IsNotEmpty()
  @IsString()
  materia: string;

  @IsNotEmpty()
  @IsNumber()
  grupoId: number;

  @IsNotEmpty()
  @IsNumber()
  aulaId: number;

  @IsNotEmpty()
  @IsNumber()
  profesorId: number;
}