// src/users/dto/create-alumno.dto.ts
import { IsEmail, IsNotEmpty, MinLength, IsDate, IsString, Matches, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAlumnoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, {
    message: 'La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número'
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellidoPaterno: string;

  @IsString()
  @IsNotEmpty()
  apellidoMaterno: string;

  @IsDate()
  @Type(() => Date)
  fechaNacimiento: Date;

  @IsString()
  @IsNotEmpty()
  matricula: string;

  @IsOptional()
  @IsNumber()
  grupoId?: number;
}