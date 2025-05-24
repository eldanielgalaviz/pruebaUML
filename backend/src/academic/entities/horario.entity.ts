
// REEMPLAZA: backend/src/academic/entities/horario.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Grupo } from './grupo.entity';
import { Aula } from './aula.entity';
import { Profesor } from './profesor.entity';
import { Asistencia } from './asistencia.entity';

// Enum para días de la semana
export enum DiaSemana {
  LUNES = 'lunes',
  MARTES = 'martes',
  MIERCOLES = 'miercoles',
  JUEVES = 'jueves',
  VIERNES = 'viernes',
  SABADO = 'sabado',
  DOMINGO = 'domingo'
}

@Entity('horarios')
export class Horario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: DiaSemana
  })
  dia: DiaSemana;

  @Column({ type: 'time' })
  horaInicio: string;

  @Column({ type: 'time' })
  horaFin: string;

  @Column()
  materia: string;

  @Column({ default: true })
  activo: boolean;

  @Column()
  grupoId: number;

  @ManyToOne(() => Grupo, grupo => grupo.horarios)
  @JoinColumn({ name: 'grupoId' })
  grupo: Grupo;

  @Column()
  aulaId: number;

  @ManyToOne(() => Aula, aula => aula.horarios)
  @JoinColumn({ name: 'aulaId' })
  aula: Aula;

  @Column()
  profesorId: number;

  @ManyToOne(() => Profesor, profesor => profesor.horarios)
  @JoinColumn({ name: 'profesorId' })
  profesor: Profesor;

  // Relación con asistencias
  @OneToMany(() => Asistencia, asistencia => asistencia.horario)
  asistencias: Asistencia[];
}