// backend/src/academic/services/alumnos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alumno } from '../entities/alumno.entity';
import { Horario } from '../entities/horario.entity';
import { CreateAlumnoAcademicDto } from '../dto/create-alumno-academic.dto';
import { UpdateAlumnoAcademicDto } from '../dto/update-alumno-academic.dto';

@Injectable()
export class AlumnosService {
  constructor(
    @InjectRepository(Alumno)
    private alumnoRepository: Repository<Alumno>,
    @InjectRepository(Horario)
    private horarioRepository: Repository<Horario>,
  ) {}

  async create(createAlumnoDto: CreateAlumnoAcademicDto): Promise<Alumno> {
    const alumno = this.alumnoRepository.create(createAlumnoDto);
    return this.alumnoRepository.save(alumno);
  }

  async findAll(): Promise<Alumno[]> {
    return this.alumnoRepository.find({
      relations: ['usuario', 'grupo'],
      where: { activo: true },
      order: { matricula: 'ASC' }
    });
  }

  async findAlumnosSinGrupo(): Promise<Alumno[]> {
    return this.alumnoRepository.find({
      relations: ['usuario'],
      where: { grupoId: null, activo: true },
      order: { matricula: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Alumno> {
    const alumno = await this.alumnoRepository.findOne({
      where: { id, activo: true },
      relations: ['usuario', 'grupo']
    });

    if (!alumno) {
      throw new NotFoundException(`Alumno con ID ${id} no encontrado`);
    }

    return alumno;
  }

  async update(id: number, updateAlumnoDto: UpdateAlumnoAcademicDto): Promise<Alumno> {
    const alumno = await this.findOne(id);
    Object.assign(alumno, updateAlumnoDto);
    return this.alumnoRepository.save(alumno);
  }

  async remove(id: number): Promise<void> {
    const alumno = await this.findOne(id);
    alumno.activo = false;
    await this.alumnoRepository.save(alumno);
  }

  async getHorariosDelAlumno(alumnoId: number): Promise<Horario[]> {
    const alumno = await this.findOne(alumnoId);
    
    if (!alumno.grupoId) {
      return [];
    }

    return this.horarioRepository.find({
      where: { grupoId: alumno.grupoId, activo: true },
      relations: ['profesor', 'profesor.usuario', 'aula'],
      order: { dia: 'ASC', horaInicio: 'ASC' }
    });
  }
}