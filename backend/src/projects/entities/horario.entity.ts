import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne } from 'typeorm';
import { Profesor } from './profesor.entity';
import { Grupo } from './grupo.entity';

@Entity()
export class Horario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  dia: string;

  @Column('text')
  horaInicio: string;

  @Column('text')
  horaFin: string;

  @Column('text')
  aula: string;

  @ManyToMany(() => Profesor, (profesor) => profesor.horarios)
  profesores: Profesor[];

  @ManyToOne(() => Grupo, (grupo) => grupo.horarios)
  grupo: Grupo;
}
