

// REEMPLAZA: backend/src/academic/entities/aula.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Horario } from './horario.entity';

@Entity('aulas')
export class Aula {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  numero: string; // Cambiado de codigo a numero

  @Column()
  capacidad: number;

  @Column({ nullable: true })
  ubicacion: string;

  @Column({ default: true })
  activa: boolean;

  @OneToMany(() => Horario, horario => horario.aula)
  horarios: Horario[];
}
