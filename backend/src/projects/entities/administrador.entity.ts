import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity()
export class Administrador {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Usuario, (usuario) => usuario.administrador)
  @JoinColumn()
  usuario: Usuario;

  //agregarAlumno
  //agregarProfesor
  //agregarGrupo
  //agregarHorario
  //generarReporteAsistencias
}
