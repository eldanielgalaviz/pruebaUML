// backend/src/academic/services/aulas.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aula } from '../entities/aula.entity';
import { CreateAulaDto } from '../dto/create-aula.dto';

@Injectable()
export class AulasService {
  constructor(
    @InjectRepository(Aula)
    private aulaRepository: Repository<Aula>,
  ) {}

  async create(createAulaDto: CreateAulaDto): Promise<Aula> {
    // Verificar que no exista otra aula con el mismo número
    const existingAula = await this.aulaRepository.findOne({
      where: { numero: createAulaDto.numero }
    });

    if (existingAula) {
      throw new ConflictException('Ya existe un aula con este número');
    }

    const aula = this.aulaRepository.create(createAulaDto);
    return this.aulaRepository.save(aula);
  }

  async findAll(): Promise<Aula[]> {
    return this.aulaRepository.find({
      where: { activa: true },
      relations: ['horarios'],
      order: { numero: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Aula> {
    const aula = await this.aulaRepository.findOne({
      where: { id, activa: true },
      relations: ['horarios', 'horarios.grupo', 'horarios.profesor', 'horarios.profesor.usuario']
    });

    if (!aula) {
      throw new NotFoundException(`Aula con ID ${id} no encontrada`);
    }

    return aula;
  }

  async findByNumero(numero: string): Promise<Aula> {
    const aula = await this.aulaRepository.findOne({
      where: { numero, activa: true },
      relations: ['horarios']
    });

    if (!aula) {
      throw new NotFoundException(`Aula ${numero} no encontrada`);
    }

    return aula;
  }

  async update(id: number, updateAulaDto: Partial<CreateAulaDto>): Promise<Aula> {
  const aula = await this.findOne(id);
  
  // Si se está cambiando el número, verificar que no exista
  if (updateAulaDto.numero && updateAulaDto.numero !== aula.numero) {
    const existingAula = await this.aulaRepository.findOne({
      where: { numero: updateAulaDto.numero }
    });

    if (existingAula) {
      throw new ConflictException('Ya existe un aula con este número');
    }
  }

  Object.assign(aula, updateAulaDto);
  return this.aulaRepository.save(aula);
}

  async remove(id: number): Promise<void> {
    const aula = await this.findOne(id);
    
    // Soft delete - marcar como inactiva
    aula.activa = false;
    await this.aulaRepository.save(aula);
  }

  async getAulasDisponibles(dia?: string, horaInicio?: string, horaFin?: string): Promise<Aula[]> {
    let query = this.aulaRepository
      .createQueryBuilder('aula')
      .leftJoinAndSelect('aula.horarios', 'horarios')
      .where('aula.activa = :activa', { activa: true });

    // Si se especifican parámetros de tiempo, filtrar aulas ocupadas
    if (dia && horaInicio && horaFin) {
      query = query.andWhere(`
        aula.id NOT IN (
          SELECT DISTINCT h.aulaId 
          FROM horarios h 
          WHERE h.dia = :dia 
          AND h.activo = true
          AND (h.horaInicio < :horaFin AND h.horaFin > :horaInicio)
        )
      `, { dia, horaInicio, horaFin });
    }

    return query.orderBy('aula.capacidad', 'DESC').getMany();
  }

  async getEstadisticasOcupacion(): Promise<any[]> {
    const aulas = await this.aulaRepository.find({
      where: { activa: true },
      relations: ['horarios']
    });

    return aulas.map(aula => {
      const horariosActivos = aula.horarios.filter(h => h.activo);
      return {
        id: aula.id,
        numero: aula.numero,
        capacidad: aula.capacidad,
        ubicacion: aula.ubicacion,
        horasOcupadas: horariosActivos.length,
        porcentajeOcupacion: (horariosActivos.length / 40) * 100, // Asumiendo 40 horas/semana máximo
        horarios: horariosActivos.map(h => ({
          dia: h.dia,
          horaInicio: h.horaInicio,
          horaFin: h.horaFin,
          materia: h.materia
        }))
      };
    }).sort((a, b) => b.porcentajeOcupacion - a.porcentajeOcupacion);
  }

  async getHorarioAula(aulaId: number): Promise<any> {
    const aula = await this.findOne(aulaId);
    
    const horariosActivos = aula.horarios.filter(h => h.activo);
    
    // Agrupar horarios por día
    const horariosPorDia = {
      lunes: [],
      martes: [],
      miercoles: [],
      jueves: [],
      viernes: [],
      sabado: [],
      domingo: []
    };

    horariosActivos.forEach(horario => {
      if (horariosPorDia[horario.dia.toLowerCase()]) {
        horariosPorDia[horario.dia.toLowerCase()].push({
          id: horario.id,
          materia: horario.materia,
          horaInicio: horario.horaInicio,
          horaFin: horario.horaFin,
          grupo: horario.grupo.nombre,
          profesor: `${horario.profesor.usuario.nombre} ${horario.profesor.usuario.apellidoPaterno}`
        });
      }
    });

    // Ordenar horarios de cada día por hora de inicio
    Object.keys(horariosPorDia).forEach(dia => {
      horariosPorDia[dia].sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
    });

    return {
      aula: {
        id: aula.id,
        numero: aula.numero,
        capacidad: aula.capacidad,
        ubicacion: aula.ubicacion
      },
      horarios: horariosPorDia,
      estadisticas: {
        totalHoras: horariosActivos.length,
        porcentajeOcupacion: (horariosActivos.length / 40) * 100,
        materias: [...new Set(horariosActivos.map(h => h.materia))],
        profesores: [...new Set(horariosActivos.map(h => 
          `${h.profesor.usuario.nombre} ${h.profesor.usuario.apellidoPaterno}`
        ))]
      }
    };
  }

  async checkDisponibilidad(numero: string, dia: string, horaInicio: string, horaFin: string): Promise<boolean> {
    const aula = await this.findByNumero(numero);
    
    const conflicto = aula.horarios.find(horario => 
      horario.activo &&
      horario.dia.toLowerCase() === dia.toLowerCase() &&
      ((horario.horaInicio < horaFin && horario.horaFin > horaInicio))
    );

    return !conflicto;
  }
  async getHorariosDelAula(aulaId: number): Promise<any[]> {
  const aula = await this.findOne(aulaId);
  
  const horariosActivos = aula.horarios.filter(h => h.activo);
  
  return horariosActivos.map(horario => ({
    id: horario.id,
    dia: horario.dia,
    horaInicio: horario.horaInicio,
    horaFin: horario.horaFin,
    materia: horario.materia,
    grupo: horario.grupo.nombre,
    profesor: `${horario.profesor.usuario.nombre} ${horario.profesor.usuario.apellidoPaterno}`
  }));
}

  async getConflictos(aulaId: number, dia: string, horaInicio: string, horaFin: string, excludeHorarioId?: number): Promise<any[]> {
    const aula = await this.findOne(aulaId);
    
    const conflictos = aula.horarios.filter(horario =>
      horario.activo &&
      horario.dia.toLowerCase() === dia.toLowerCase() &&
      horario.horaInicio < horaFin &&
      horario.horaFin > horaInicio &&
      (!excludeHorarioId || horario.id !== excludeHorarioId)
    );

    return conflictos.map(horario => ({
      id: horario.id,
      materia: horario.materia,
      horaInicio: horario.horaInicio,
      horaFin: horario.horaFin,
      grupo: horario.grupo.nombre,
      profesor: `${horario.profesor.usuario.nombre} ${horario.profesor.usuario.apellidoPaterno}`
    }));
  }

  async getAulasByCapacidad(capacidadMinima: number): Promise<Aula[]> {
    return this.aulaRepository.find({
      where: { 
        activa: true
      },
      order: { capacidad: 'DESC' }
    }).then(aulas => aulas.filter(aula => aula.capacidad >= capacidadMinima));
  }

  async getReporteOcupacion(): Promise<any> {
    const aulas = await this.getEstadisticasOcupacion();
    
    const totalAulas = aulas.length;
    const aulasOcupadas = aulas.filter(aula => aula.horasOcupadas > 0).length;
    const promedioOcupacion = aulas.reduce((sum, aula) => sum + aula.porcentajeOcupacion, 0) / totalAulas;
    
    return {
      resumen: {
        totalAulas,
        aulasOcupadas,
        aulasLibres: totalAulas - aulasOcupadas,
        promedioOcupacion: Math.round(promedioOcupacion * 100) / 100
      },
      aulasMasOcupadas: aulas.slice(0, 5),
      aulasMenosOcupadas: aulas.slice(-5).reverse()
    };
  }
}