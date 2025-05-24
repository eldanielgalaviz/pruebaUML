// backend/src/users/dto/create-aula.dto.ts
import { IsNotEmpty, IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateAulaDto {
  @IsNotEmpty()
  @IsString()
  numero: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  capacidad: number;

  @IsOptional()
  @IsString()
  ubicacion?: string;
}