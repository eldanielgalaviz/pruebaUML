import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Profesor } from './profesor.entity';

@Entity()
export class Asistencia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('date')
  fecha: Date;

  @Column('boolean')
  presente: boolean;

  @ManyToOne(() => Profesor, (profesor) => profesor.asistencias)
  profesor: Profesor;
}
