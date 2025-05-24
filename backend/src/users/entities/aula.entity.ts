import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Horario } from './horario.entity';

@Entity('aulas')
export class Aula {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  numero: string;

  @Column()
  capacidad: number;

  @Column({ nullable: true })
  ubicacion: string;

  @Column({ default: true })
  activa: boolean; // AÑADE ESTE CAMPO

  @OneToMany(() => Horario, horario => horario.aula)
  horarios: Horario[];
}