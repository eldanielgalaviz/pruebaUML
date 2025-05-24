
// REEMPLAZA: backend/src/academic/entities/grupo.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { Alumno } from './alumno.entity';
import { JefeGrupo } from './jefe-grupo.entity';
import { Horario } from './horario.entity';

@Entity('grupos')
export class Grupo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ nullable: true, unique: true })
  codigo: string;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => Alumno, alumno => alumno.grupo)
  alumnos: Alumno[];

  @OneToOne(() => JefeGrupo, jefeGrupo => jefeGrupo.grupo)
  jefeGrupo: JefeGrupo;

  @OneToMany(() => Horario, horario => horario.grupo)
  horarios: Horario[];
}
