// backend/src/academic/services/asistencias.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Asistencia } from '../entities/asistencia.entity';
import { Profesor } from '../entities/profesor.entity';
import { Horario } from '../entities/horario.entity';
import { CreateAsistenciaDto } from '../dto/create-asistencia.dto';
import { UpdateAsistenciaDto } from '../dto/update-asistencia.dto';

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

    // Validar que existe el horario si se proporciona
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
async generateReport(fechaInicio: Date, fechaFin: Date): Promise<any> {
  return this.getReporteAsistencias(fechaInicio, fechaFin);
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

  async update(id: number, updateAsistenciaDto: UpdateAsistenciaDto): Promise<Asistencia> {
    const asistencia = await this.findOne(id);
    
    // Si se está cambiando el horario, validar que pertenece al profesor
    if (updateAsistenciaDto.horarioId && updateAsistenciaDto.horarioId !== asistencia.horarioId) {
      const horario = await this.horarioRepository.findOne({
        where: { id: updateAsistenciaDto.horarioId, activo: true }
      });

      if (!horario) {
        throw new NotFoundException('Horario no encontrado');
      }

      if (horario.profesorId !== asistencia.profesorId) {
        throw new BadRequestException('El horario no pertenece al profesor de esta asistencia');
      }
    }

    Object.assign(asistencia, updateAsistenciaDto);
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

  async getReporteAsistencias(fechaInicio: Date, fechaFin: Date): Promise<any> {
    const asistencias = await this.asistenciaRepository
      .createQueryBuilder('asistencia')
      .leftJoinAndSelect('asistencia.profesor', 'profesor')
      .leftJoinAndSelect('profesor.usuario', 'usuario')
      .leftJoinAndSelect('asistencia.horario', 'horario')
      .where('asistencia.fecha BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio,
        fechaFin
      })
      .getMany();

    const reportePorProfesor = {};

    asistencias.forEach(asistencia => {
      const profesorKey = asistencia.profesor.idProfesor;
      
      if (!reportePorProfesor[profesorKey]) {
        reportePorProfesor[profesorKey] = {
          profesor: {
            id: asistencia.profesor.id,
            idProfesor: asistencia.profesor.idProfesor,
            nombre: `${asistencia.profesor.usuario.nombre} ${asistencia.profesor.usuario.apellidoPaterno}`
          },
          totalAsistencias: 0,
          asistenciasPresentes: 0,
          faltas: 0,
          porcentajeAsistencia: 0
        };
      }

      reportePorProfesor[profesorKey].totalAsistencias++;
      if (asistencia.asistio) {
        reportePorProfesor[profesorKey].asistenciasPresentes++;
      } else {
        reportePorProfesor[profesorKey].faltas++;
      }
    });

    // Calcular porcentajes
    Object.keys(reportePorProfesor).forEach(profesorKey => {
      const reporte = reportePorProfesor[profesorKey];
      reporte.porcentajeAsistencia = reporte.totalAsistencias > 0 
        ? Math.round((reporte.asistenciasPresentes / reporte.totalAsistencias) * 100 * 100) / 100
        : 0;
    });

    const reporteArray = Object.values(reportePorProfesor).sort((a: any, b: any) => 
      b.porcentajeAsistencia - a.porcentajeAsistencia
    );

    const totalRegistros = asistencias.length;
    const totalPresentes = asistencias.filter(a => a.asistio).length;
    const totalFaltas = totalRegistros - totalPresentes;
    const promedioAsistencia = totalRegistros > 0 ? (totalPresentes / totalRegistros) * 100 : 0;

    return {
      periodo: {
        fechaInicio,
        fechaFin
      },
      resumenGeneral: {
        totalRegistros,
        totalPresentes,
        totalFaltas,
        promedioAsistencia: Math.round(promedioAsistencia * 100) / 100,
        totalProfesores: Object.keys(reportePorProfesor).length
      },
      reportePorProfesor: reporteArray
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

  async getAsistenciasPorFecha(fecha: Date): Promise<any[]> {
    const asistencias = await this.asistenciaRepository.find({
      where: { fecha },
      relations: ['profesor', 'profesor.usuario', 'horario', 'horario.grupo', 'horario.aula'],
      order: { hora: 'ASC' }
    });

    return asistencias.map(asistencia => ({
      id: asistencia.id,
      fecha: asistencia.fecha,
      hora: asistencia.hora,
      asistio: asistencia.asistio,
      observaciones: asistencia.observaciones,
      profesor: {
        id: asistencia.profesor.id,
        idProfesor: asistencia.profesor.idProfesor,
        nombre: `${asistencia.profesor.usuario.nombre} ${asistencia.profesor.usuario.apellidoPaterno}`
      },
      horario: asistencia.horario ? {
        id: asistencia.horario.id,
        materia: asistencia.horario.materia,
        horaInicio: asistencia.horario.horaInicio,
        horaFin: asistencia.horario.horaFin,
        grupo: asistencia.horario.grupo.nombre,
        aula: asistencia.horario.aula.numero
      } : null
    }));
  }

  async getProfesoresSinAsistencia(fecha: Date): Promise<any[]> {
    // Obtener todos los profesores activos
    const profesoresActivos = await this.profesorRepository.find({
      where: { activo: true },
      relations: ['usuario', 'horarios']
    });

    // Obtener profesores que ya tienen asistencia registrada para esta fecha
    const profesoresConAsistencia = await this.asistenciaRepository
      .createQueryBuilder('asistencia')
      .select('DISTINCT asistencia.profesorId')
      .where('asistencia.fecha = :fecha', { fecha })
      .getRawMany();

    const idsConAsistencia = profesoresConAsistencia.map(p => p.profesorId);

    // Filtrar profesores sin asistencia
    const profesoresSinAsistencia = profesoresActivos.filter(profesor => 
      !idsConAsistencia.includes(profesor.id)
    );

    return profesoresSinAsistencia.map(profesor => ({
      id: profesor.id,
      idProfesor: profesor.idProfesor,
      nombre: `${profesor.usuario.nombre} ${profesor.usuario.apellidoPaterno}`,
      email: profesor.usuario.email,
      horariosDelDia: profesor.horarios
        .filter(h => h.activo && h.dia.toLowerCase() === this.getDiaSemana(fecha))
        .map(h => ({
          id: h.id,
          materia: h.materia,
          horaInicio: h.horaInicio,
          horaFin: h.horaFin
        }))
    }));
  }

  async getEstadisticasAsistencia(fechaInicio: Date, fechaFin: Date): Promise<any> {
    const asistencias = await this.asistenciaRepository
      .createQueryBuilder('asistencia')
      .leftJoinAndSelect('asistencia.profesor', 'profesor')
      .leftJoinAndSelect('profesor.usuario', 'usuario')
      .where('asistencia.fecha BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio,
        fechaFin
      })
      .getMany();

    const totalRegistros = asistencias.length;
    const totalPresentes = asistencias.filter(a => a.asistio).length;
    const totalFaltas = totalRegistros - totalPresentes;

    // Agrupar por día de la semana
    const asistenciasPorDia = {
      lunes: { total: 0, presentes: 0 },
      martes: { total: 0, presentes: 0 },
      miercoles: { total: 0, presentes: 0 },
      jueves: { total: 0, presentes: 0 },
      viernes: { total: 0, presentes: 0 },
      sabado: { total: 0, presentes: 0 },
      domingo: { total: 0, presentes: 0 }
    };

    asistencias.forEach(asistencia => {
      const diaSemana = this.getDiaSemana(asistencia.fecha);
      if (asistenciasPorDia[diaSemana]) {
        asistenciasPorDia[diaSemana].total++;
        if (asistencia.asistio) {
          asistenciasPorDia[diaSemana].presentes++;
        }
      }
    });

    // Calcular porcentajes por día
    Object.keys(asistenciasPorDia).forEach(dia => {
      const datos = asistenciasPorDia[dia];
      datos.porcentaje = datos.total > 0 ? Math.round((datos.presentes / datos.total) * 100 * 100) / 100 : 0;
    });

    return {
      periodo: { fechaInicio, fechaFin },
      resumen: {
        totalRegistros,
        totalPresentes,
        totalFaltas,
        porcentajeGeneral: totalRegistros > 0 ? Math.round((totalPresentes / totalRegistros) * 100 * 100) / 100 : 0
      },
      asistenciasPorDia
    };
  }

  private getDiaSemana(fecha: Date): string {
    const dias = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    return dias[fecha.getDay()];
  }

  async exportarReporte(fechaInicio: Date, fechaFin: Date, formato: 'json' | 'csv' = 'json'): Promise<any> {
    const reporte = await this.getReporteAsistencias(fechaInicio, fechaFin);
    
    if (formato === 'csv') {
      // Convertir a formato CSV
      const csvHeaders = ['ID Profesor', 'Nombre', 'Total Asistencias', 'Presentes', 'Faltas', 'Porcentaje'];
      const csvRows = reporte.reportePorProfesor.map((item: any) => [
        item.profesor.idProfesor,
        item.profesor.nombre,
        item.totalAsistencias,
        item.asistenciasPresentes,
        item.faltas,
        `${item.porcentajeAsistencia}%`
      ]);

      return {
        headers: csvHeaders,
        rows: csvRows,
        resumen: reporte.resumenGeneral
      };
    }

    return reporte;
  }
}