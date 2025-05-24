import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProfesorAcademicDto {
  @IsNotEmpty()
  @IsString()
  codigoProfesor: string;

  @IsNumber()
  userId: number;

  @IsOptional()
  @IsString()
  departamento?: string;

  @IsOptional()
  @IsString()
  especialidad?: string;
}