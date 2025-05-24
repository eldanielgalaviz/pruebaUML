import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Horario } from './horario.entity';
import { Asistencia } from './asistencia.entity';

@Entity()
export class Profesor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  idProfesor: string;

  @OneToOne(() => Usuario, (usuario) => usuario.profesor)
  @JoinColumn()
  usuario: Usuario;

  @ManyToMany(() => Horario, (horario) => horario.profesores)
  @JoinTable()
  horarios: Horario[];

  @OneToMany(() => Asistencia, (asistencia) => asistencia.profesor)
  asistencias: Asistencia[];

  //tomarAsistencia
  //verHorariosAsignados
}
