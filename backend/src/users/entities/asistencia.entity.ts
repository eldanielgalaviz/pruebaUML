import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Profesor } from './profesor.entity';
import { Horario } from './horario.entity';
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

  @Column({ nullable: true, type: 'text' })
  observaciones: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relación con Profesor
  @Column()
  profesorId: number;

  @ManyToOne(() => Profesor, profesor => profesor.asistencias)
  @JoinColumn({ name: 'profesorId' })
  profesor: Profesor;

  // Relación opcional con Horario
  @Column({ nullable: true })
  horarioId: number;

  @ManyToOne(() => Horario, horario => horario.asistencias, { nullable: true })
  @JoinColumn({ name: 'horarioId' })
  horario: Horario;

  // Relación con Checador
  @Column({ nullable: true })
  checadorId: number;

  @ManyToOne(() => Checador, checador => checador.asistencias, { nullable: true })
  @JoinColumn({ name: 'checadorId' })
  checador: Checador;
}