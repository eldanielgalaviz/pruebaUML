// REEMPLAZA: backend/src/academic/entities/alumno.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Grupo } from './grupo.entity';

@Entity('alumnos')
export class Alumno {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  matricula: string;

  @Column({ default: true })
  activo: boolean;

  @Column()
  userId: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  usuario: User;

  @Column({ nullable: true })
  grupoId: number;

  @ManyToOne(() => Grupo, grupo => grupo.alumnos, { nullable: true })
  @JoinColumn({ name: 'grupoId' })
  grupo: Grupo;
}

