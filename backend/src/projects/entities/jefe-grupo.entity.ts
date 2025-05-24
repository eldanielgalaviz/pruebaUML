import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Grupo } from './grupo.entity';

@Entity()
export class JefeGrupo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Usuario, (usuario) => usuario.jefeGrupo)
  @JoinColumn()
  usuario: Usuario;

  @ManyToOne(() => Grupo, (grupo) => grupo.jefesGrupo)
  grupo: Grupo;

  //verHorarioGrupo
  //verHorarioProfesor
}
