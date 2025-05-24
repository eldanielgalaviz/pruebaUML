// src/users/entities/horario.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Grupo } from './grupo.entity';
import { Aula } from './aula.entity';
import { Profesor } from './profesor.entity';

@Entity('horarios')
export class Horario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dia: string;

  @Column({ type: 'time' })
  horaInicio: string;

  @Column({ type: 'time' })
  horaFin: string;

  @Column()
  materia: string;

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
}
