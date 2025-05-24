// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Alumno } from './entities/alumno.entity';
import { JefeGrupo } from './entities/jefe-grupo.entity';
import { Profesor } from './entities/profesor.entity';
import { Checador } from './entities/checador.entity';
import { Administrador } from './entities/administrador.entity';
import { Grupo } from './entities/grupo.entity';
import { Horario } from './entities/horario.entity';
import { Aula } from './entities/aula.entity';
import { Asistencia } from './entities/asistencia.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Alumno,
      JefeGrupo,
      Profesor,
      Checador,
      Administrador,
      Grupo,
      Horario,
      Aula,
      Asistencia
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}