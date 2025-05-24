import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateGrupoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNotEmpty()
  @IsString()
  codigo: string;
}