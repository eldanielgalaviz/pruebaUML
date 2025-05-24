import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grupo } from '../entities/grupo.entity';
import { Alumno } from '../entities/alumno.entity';
import { Horario } from '../entities/horario.entity';
import { CreateGrupoDto } from '../dto/create-grupo.dto';
import { UpdateGrupoDto } from '../dto/update-grupo.dto';


@Injectable()
export class GruposService {
  constructor(
    @InjectRepository(Grupo)
    private grupoRepository: Repository<Grupo>,
    @InjectRepository(Alumno)
    private alumnoRepository: Repository<Alumno>,
    @InjectRepository(Horario)
    private horarioRepository: Repository<Horario>,
  ) {}

  async create(createGrupoDto: CreateGrupoDto): Promise<Grupo> {
    // Verificar que no exista otro grupo con el mismo código
    const existingGrupo = await this.grupoRepository.findOne({
      where: { codigo: createGrupoDto.codigo }
    });

    if (existingGrupo) {
      throw new ConflictException('Ya existe un grupo con este código');
    }

    const grupo = this.grupoRepository.create(createGrupoDto);
    return this.grupoRepository.save(grupo);
  }

  async findAll(): Promise<Grupo[]> {
    return this.grupoRepository.find({
      relations: ['alumnos', 'alumnos.usuario', 'jefeGrupo', 'jefeGrupo.usuario', 'horarios'],
      where: { activo: true }
    });
  }

  async findOne(id: number): Promise<Grupo> {
    const grupo = await this.grupoRepository.findOne({
      where: { id, activo: true },
      relations: ['alumnos', 'alumnos.usuario', 'jefeGrupo', 'jefeGrupo.usuario', 'horarios', 'horarios.profesor', 'horarios.aula']
    });

    if (!grupo) {
      throw new NotFoundException(`Grupo con ID ${id} no encontrado`);
    }

    return grupo;
  }

  async update(id: number, updateGrupoDto: UpdateGrupoDto): Promise<Grupo> {
    const grupo = await this.findOne(id);
    
    // Si se está cambiando el código, verificar que no exista
    if (updateGrupoDto.codigo && updateGrupoDto.codigo !== grupo.codigo) {
      const existingGrupo = await this.grupoRepository.findOne({
        where: { codigo: updateGrupoDto.codigo }
      });

      if (existingGrupo) {
        throw new ConflictException('Ya existe un grupo con este código');
      }
    }

    Object.assign(grupo, updateGrupoDto);
    return this.grupoRepository.save(grupo);
  }

  async remove(id: number): Promise<void> {
    const grupo = await this.findOne(id);
    
    // Soft delete - marcar como inactivo
    grupo.activo = false;
    await this.grupoRepository.save(grupo);
  }

  // MÉTODOS DE ASIGNACIÓN
  async asignarAlumno(grupoId: number, alumnoId: number): Promise<Grupo> {
    const grupo = await this.findOne(grupoId);
    const alumno = await this.alumnoRepository.findOne({
      where: { id: alumnoId },
      relations: ['usuario']
    });

    if (!alumno) {
      throw new NotFoundException(`Alumno con ID ${alumnoId} no encontrado`);
    }

    // Verificar si el alumno ya está en otro grupo
    if (alumno.grupoId && alumno.grupoId !== grupoId) {
      throw new ConflictException('El alumno ya está asignado a otro grupo');
    }

    // Asignar alumno al grupo
    alumno.grupoId = grupoId;
    await this.alumnoRepository.save(alumno);

    return this.findOne(grupoId);
  }

  async removerAlumno(grupoId: number, alumnoId: number): Promise<Grupo> {
    const grupo = await this.findOne(grupoId);
    const alumno = await this.alumnoRepository.findOne({
      where: { id: alumnoId, grupoId: grupoId }
    });

    if (!alumno) {
      throw new NotFoundException(`Alumno no encontrado en este grupo`);
    }

    // Remover asignación
    alumno.grupoId = null;
    await this.alumnoRepository.save(alumno);

    return this.findOne(grupoId);
  }

  async getAlumnosDelGrupo(grupoId: number): Promise<Alumno[]> {
    return this.alumnoRepository.find({
      where: { grupoId, activo: true },
      relations: ['usuario']
    });
  }

  async getHorariosDelGrupo(grupoId: number): Promise<Horario[]> {
    return this.horarioRepository.find({
      where: { grupoId, activo: true },
      relations: ['profesor', 'profesor.usuario', 'aula'],
      order: { dia: 'ASC', horaInicio: 'ASC' }
    });
  }

  // Método para obtener grupos disponibles (sin muchos alumnos)
  async getGruposDisponibles(): Promise<Grupo[]> {
    const grupos = await this.grupoRepository.find({
      where: { activo: true },
      relations: ['alumnos']
    });

    // Filtrar grupos que tengan menos de un límite (ej: 30 alumnos)
    return grupos.filter(grupo => grupo.alumnos.length < 30);
  }
}