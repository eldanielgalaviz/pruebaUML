// src/users/entities/asistencia.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Profesor } from './profesor.entity';
import { Checador } from './checador.entity';

@Entity('asistencias')
export class Asistencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'time' })
  hora: string;

  @Column({ default: false })
  asistio: boolean;

  @Column({ nullable: true })
  observaciones: string;

  @Column()
  profesorId: number;

  @ManyToOne(() => Profesor, profesor => profesor.asistencias)
  @JoinColumn({ name: 'profesorId' })
  profesor: Profesor;

  @Column()
  checadorId: number;

  @ManyToOne(() => Checador, checador => checador.asistencias)
  @JoinColumn({ name: 'checadorId' })
  checador: Checador;
}