import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Alumno } from './alumno.entity';
import { JefeGrupo } from './jefe-grupo.entity';
import { Horario } from './horario.entity';

@Entity()
export class Grupo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  nombre: string;

  @OneToMany(() => Alumno, (alumno) => alumno.grupo)
  alumnos: Alumno[];

  @OneToMany(() => JefeGrupo, (jefeGrupo) => jefeGrupo.grupo)
  jefesGrupo: JefeGrupo[];

  @OneToMany(() => Horario, (horario) => horario.grupo)
  horarios: Horario[];
}
