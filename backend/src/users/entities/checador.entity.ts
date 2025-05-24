// src/users/entities/checador.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Asistencia } from './asistencia.entity';

@Entity('checadores')
export class Checador {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  usuario: User;

  @OneToMany(() => Asistencia, asistencia => asistencia.checador)
  asistencias: Asistencia[];
}