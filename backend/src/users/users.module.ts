// backend/src/users/users.module.ts - VERSIÓN FINAL
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Services
import { UsersService } from './users.service';
import { GruposService } from './services/grupos.service';
import { HorariosService } from './services/horarios.service';
import { AulasService } from './services/aulas.service';
import { ProfesoresService } from './services/profesores.service';

// Controllers
import { UsersController } from './users.controller';
import { GruposController } from './controllers/grupos.controller';
import { HorariosController } from './controllers/horarios.controller';
import { AulasController } from './controllers/aulas.controller';
import { ProfesoresController } from './controllers/profesores.controller';

// Entities
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
  controllers: [
    UsersController,
    GruposController,
    HorariosController,
    AulasController,
    ProfesoresController
  ],
  providers: [
    UsersService,
    GruposService,
    HorariosService,
    AulasService,
    ProfesoresService
  ],
  exports: [
    UsersService,
    GruposService,
    HorariosService,
    AulasService,
    ProfesoresService
  ],
})
export class UsersModule {}