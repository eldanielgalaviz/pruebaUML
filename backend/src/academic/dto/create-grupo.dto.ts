import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateGrupoDto {
  @IsNotEmpty()
  @IsString()
  codigo: string;

  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  grado?: string;

  @IsOptional()
  @IsString()
  periodo?: string;
}