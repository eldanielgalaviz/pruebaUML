import { IsNotEmpty, IsBoolean, IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAsistenciaDto {
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  fecha: Date;

  @IsNotEmpty()
  @IsString()
  hora: string;

  @IsNotEmpty()
  @IsBoolean()
  asistio: boolean;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsNotEmpty()
  @IsNumber()
  profesorId: number;

  @IsOptional()
  @IsNumber()
  horarioId?: number;
}