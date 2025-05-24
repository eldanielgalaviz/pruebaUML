import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity()
export class Checador {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Usuario, (usuario) => usuario.checador)
  @JoinColumn()
  usuario: Usuario;

  //verTodosMaestros
  //marcarAsistencia
  //verHorariosMaestros
}
