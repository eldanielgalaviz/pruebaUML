import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Grupo } from './grupo.entity';

@Entity()
export class Alumno {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  matricula: string;

  @OneToOne(() => Usuario, (usuario) => usuario.alumno)
  @JoinColumn()
  usuario: Usuario;

  @ManyToOne(() => Grupo, (grupo) => grupo.alumnos)
  grupo: Grupo;

  //verHorario
}
