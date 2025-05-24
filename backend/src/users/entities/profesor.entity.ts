import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Horario } from './horario.entity';
import { Asistencia } from './asistencia.entity';

@Entity('profesores')
export class Profesor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  idProfesor: string;

  @Column({ default: true })
  activo: boolean; // AÑADE ESTE CAMPO

  @Column()
  userId: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  usuario: User;

  @OneToMany(() => Horario, horario => horario.profesor)
  horarios: Horario[];

  @OneToMany(() => Asistencia, asistencia => asistencia.profesor)
  asistencias: Asistencia[];
}