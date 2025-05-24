import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateAulaDto {
  @IsNotEmpty()
  @IsString()
  codigo: string;

  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNumber()
  capacidad: number;

  @IsOptional()
  @IsString()
  ubicacion?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}