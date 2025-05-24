import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Controllers
import { AulasController } from './controllers/aulas.controller';
import { GruposController } from './controllers/grupos.controller';
import { HorariosController } from './controllers/horarios.controller';
import { AlumnosController } from './controllers/alumnos.controller';
import { ProfesoresController } from './controllers/profesores.controller';
import { AsistenciasController } from './controllers/asistencias.controller';

// Services
import { AulasService } from './services/aulas.service';
import { GruposService } from './services/grupos.service';
import { HorariosService } from './services/horarios.service';
import { AlumnosService } from './services/alumnos.service';
import { ProfesoresService } from './services/profesores.service';
import { AsistenciasService } from './services/asistencias.service';

// Entities
import { Aula } from './entities/aula.entity';
import { Grupo } from './entities/grupo.entity';
import { Horario } from './entities/horario.entity';
import { Alumno } from './entities/alumno.entity';
import { Profesor } from './entities/profesor.entity';
import { JefeGrupo } from './entities/jefe-grupo.entity';
import { Checador } from './entities/checador.entity';
import { Administrador } from './entities/administrador.entity';
import { Asistencia } from './entities/asistencia.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Aula,
      Grupo,
      Horario,
      Alumno,
      Profesor,
      JefeGrupo,
      Checador,
      Administrador,
      Asistencia,
      User
    ])
  ],
  controllers: [
    AulasController,
    GruposController,
    HorariosController,
    AlumnosController,
    ProfesoresController,
    AsistenciasController
  ],
  providers: [
    AulasService,
    GruposService,
    HorariosService,
    AlumnosService,
    ProfesoresService,
    AsistenciasService
  ],
  exports: [
    AulasService,
    GruposService,
    HorariosService,
    AlumnosService,
    ProfesoresService,
    AsistenciasService
  ]
})
export class AcademicModule {}