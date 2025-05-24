import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateAlumnoAcademicDto {
  @IsNotEmpty()
  @IsString()
  matricula: string;

  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  grupoId?: number;
}