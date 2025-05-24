// src/users/entities/jefe-grupo.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Grupo } from './grupo.entity';

@Entity('jefes_grupo')
export class JefeGrupo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  usuario: User;

  @Column()
  grupoId: number;

  @OneToOne(() => Grupo, grupo => grupo.jefeGrupo)
  @JoinColumn({ name: 'grupoId' })
  grupo: Grupo;
}