import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Alumno } from './alumno.entity';
import { JefeGrupo } from './jefe-grupo.entity';
import { Profesor } from './profesor.entity';
import { Checador } from './checador.entity';
import { Administrador } from './administrador.entity';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  nombre: string;

  @Column('text')
  email: string;

  @Column('text')
  password: string;

  @Column('text')
  rol: string;

  @OneToOne(() => Alumno, (alumno) => alumno.usuario)
  alumno: Alumno;

    @OneToOne(() => JefeGrupo, (jefeGrupo) => jefeGrupo.usuario)
  jefeGrupo: JefeGrupo;

    @OneToOne(() => Profesor, (profesor) => profesor.usuario)
  profesor: Profesor;

    @OneToOne(() => Checador, (checador) => checador.usuario)
  checador: Checador;

    @OneToOne(() => Administrador, (administrador) => administrador.usuario)
  administrador: Administrador;

  //login
}
