import { IsEmail, IsNotEmpty, MinLength, IsDate, IsString, Matches, IsOptional, IsEnum } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de usuario es requerido' })
  @MinLength(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' })
  username: string;

  @IsEmail({}, { message: 'Debe ser un email válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/, {
    message: 'La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número'
  })
  password: string;

  @IsNotEmpty({ message: 'Debe confirmar la contraseña' })
  @IsString()
  confirmPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  nombre: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido paterno es requerido' })
  apellidoPaterno: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido materno es requerido' })
  apellidoMaterno: string;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return new Date(value);
    }
    return value;
  })
  @IsDate({ message: 'Debe ser una fecha válida' })
  @Type(() => Date)
  fechaNacimiento: Date;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Rol debe ser válido' })
  rol?: UserRole;

  // Campos opcionales para el registro
  @IsOptional()
  confirmationToken?: string;

  @IsOptional()
  isEmailConfirmed?: boolean;
}