import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asistencia } from '../entities/asistencia.entity';
import { Profesor } from '../entities/profesor.entity';
import { Horario } from '../entities/horario.entity';
import { CreateAsistenciaDto } from '../dto/create-asistencia.dto';

@Injectable()
export class AsistenciasService {
  constructor(
    @InjectRepository(Asistencia)
    private asistenciaRepository: Repository<Asistencia>,
    @InjectRepository(Profesor)
    private profesorRepository: Repository<Profesor>,
    @InjectRepository(Horario)
    private horarioRepository: Repository<Horario>,
  ) {}

  async create(createAsistenciaDto: CreateAsistenciaDto): Promise<Asistencia> {
    // Validar que existe el profesor
    const profesor = await this.profesorRepository.findOne({
      where: { id: createAsistenciaDto.profesorId, activo: true }
    });

    if (!profesor) {
      throw new NotFoundException('Profesor no encontrado');
    }

    // Validar horario si se proporciona
    if (createAsistenciaDto.horarioId) {
      const horario = await this.horarioRepository.findOne({
        where: { id: createAsistenciaDto.horarioId, activo: true }
      });

      if (!horario) {
        throw new NotFoundException('Horario no encontrado');
      }

      // Verificar que el horario pertenece al profesor
      if (horario.profesorId !== createAsistenciaDto.profesorId) {
        throw new BadRequestException('El horario no pertenece al profesor especificado');
      }
    }

    // Verificar que no existe otra asistencia para el mismo profesor en el mismo día y horario
    const existingAsistencia = await this.asistenciaRepository.findOne({
      where: {
        profesorId: createAsistenciaDto.profesorId,
        fecha: createAsistenciaDto.fecha,
        horarioId: createAsistenciaDto.horarioId || null
      }
    });

    if (existingAsistencia) {
      throw new BadRequestException('Ya existe un registro de asistencia para este profesor en esta fecha y horario');
    }

    const asistencia = this.asistenciaRepository.create(createAsistenciaDto);
    return this.asistenciaRepository.save(asistencia);
  }

  async findAll(
    fechaInicio?: Date,
    fechaFin?: Date,
    profesorId?: number
  ): Promise<Asistencia[]> {
    let query = this.asistenciaRepository
      .createQueryBuilder('asistencia')
      .leftJoinAndSelect('asistencia.profesor', 'profesor')
      .leftJoinAndSelect('profesor.usuario', 'usuario')
      .leftJoinAndSelect('asistencia.horario', 'horario')
      .leftJoinAndSelect('horario.grupo', 'grupo')
      .leftJoinAndSelect('horario.aula', 'aula');

    if (fechaInicio && fechaFin) {
      query = query.where('asistencia.fecha BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio,
        fechaFin
      });
    }

    if (profesorId) {
      query = query.andWhere('asistencia.profesorId = :profesorId', { profesorId });
    }

    return query
      .orderBy('asistencia.fecha', 'DESC')
      .addOrderBy('asistencia.hora', 'DESC')
      .getMany();
  }

  async findOne(id: number): Promise<Asistencia> {
    const asistencia = await this.asistenciaRepository.findOne({
      where: { id },
      relations: ['profesor', 'profesor.usuario', 'horario', 'horario.grupo', 'horario.aula']
    });

    if (!asistencia) {
      throw new NotFoundException(`Asistencia con ID ${id} no encontrada`);
    }

    return asistencia;
  }

  async update(id: number, updateData: Partial<CreateAsistenciaDto>): Promise<Asistencia> {
    const asistencia = await this.findOne(id);
    
    // Si se está cambiando el horario, validar que pertenece al profesor
    if (updateData.horarioId && updateData.horarioId !== asistencia.horarioId) {
      const horario = await this.horarioRepository.findOne({
        where: { id: updateData.horarioId, activo: true }
      });

      if (!horario) {
        throw new NotFoundException('Horario no encontrado');
      }

      if (horario.profesorId !== asistencia.profesorId) {
        throw new BadRequestException('El horario no pertenece al profesor de esta asistencia');
      }
    }

    Object.assign(asistencia, updateData);
    return this.asistenciaRepository.save(asistencia);
  }

  async remove(id: number): Promise<void> {
    const asistencia = await this.findOne(id);
    await this.asistenciaRepository.remove(asistencia);
  }

  async getAsistenciasPorProfesor(profesorId: number, fechaInicio?: Date, fechaFin?: Date): Promise<any> {
    const profesor = await this.profesorRepository.findOne({
      where: { id: profesorId, activo: true },
      relations: ['usuario']
    });

    if (!profesor) {
      throw new NotFoundException('Profesor no encontrado');
    }

    let query = this.asistenciaRepository
      .createQueryBuilder('asistencia')
      .leftJoinAndSelect('asistencia.horario', 'horario')
      .leftJoinAndSelect('horario.grupo', 'grupo')
      .leftJoinAndSelect('horario.aula', 'aula')
      .where('asistencia.profesorId = :profesorId', { profesorId });

    if (fechaInicio && fechaFin) {
      query = query.andWhere('asistencia.fecha BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio,
        fechaFin
      });
    }

    const asistencias = await query
      .orderBy('asistencia.fecha', 'DESC')
      .getMany();

    const totalAsistencias = asistencias.length;
    const asistenciasPresentes = asistencias.filter(a => a.asistio).length;
    const porcentajeAsistencia = totalAsistencias > 0 ? (asistenciasPresentes / totalAsistencias) * 100 : 0;

    return {
      profesor: {
        id: profesor.id,
        idProfesor: profesor.idProfesor,
        nombre: `${profesor.usuario.nombre} ${profesor.usuario.apellidoPaterno}`
      },
      estadisticas: {
        totalAsistencias,
        asistenciasPresentes,
        faltas: totalAsistencias - asistenciasPresentes,
        porcentajeAsistencia: Math.round(porcentajeAsistencia * 100) / 100
      },
      asistencias: asistencias.map(asistencia => ({
        id: asistencia.id,
        fecha: asistencia.fecha,
        hora: asistencia.hora,
        asistio: asistencia.asistio,
        observaciones: asistencia.observaciones,
        horario: asistencia.horario ? {
          materia: asistencia.horario.materia,
          grupo: asistencia.horario.grupo.nombre,
          aula: asistencia.horario.aula.numero,
          horaInicio: asistencia.horario.horaInicio,
          horaFin: asistencia.horario.horaFin
        } : null
      }))
    };
  }

  async marcarAsistencia(profesorId: number, fecha: Date, hora: string, asistio: boolean, horarioId?: number, observaciones?: string): Promise<Asistencia> {
    // Verificar si ya existe un registro para este profesor en esta fecha
    const existingAsistencia = await this.asistenciaRepository.findOne({
      where: {
        profesorId,
        fecha,
        horarioId: horarioId || null
      }
    });

    if (existingAsistencia) {
      // Actualizar el registro existente
      existingAsistencia.hora = hora;
      existingAsistencia.asistio = asistio;
      if (observaciones) {
        existingAsistencia.observaciones = observaciones;
      }
      return this.asistenciaRepository.save(existingAsistencia);
    } else {
      // Crear nuevo registro
      const createAsistenciaDto: CreateAsistenciaDto = {
        profesorId,
        fecha,
        hora,
        asistio,
        horarioId,
        observaciones
      };
      return this.create(createAsistenciaDto);
    }
  }
}