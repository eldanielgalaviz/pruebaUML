import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Horario, DiaSemana } from '../entities/horario.entity';
import { Grupo } from '../entities/grupo.entity';
import { Profesor } from '../entities/profesor.entity';
import { Aula } from '../entities/aula.entity';
import { CreateHorarioDto } from '../dto/create-horario.dto';
import { UpdateHorarioDto } from '../dto/update-horario.dto';

@Injectable()
export class HorariosService {
  constructor(
    @InjectRepository(Horario)
    private horarioRepository: Repository<Horario>,
    @InjectRepository(Grupo)
    private grupoRepository: Repository<Grupo>,
    @InjectRepository(Profesor)
    private profesorRepository: Repository<Profesor>,
    @InjectRepository(Aula)
    private aulaRepository: Repository<Aula>,
  ) {}

  async create(createHorarioDto: CreateHorarioDto): Promise<Horario> {
    // Validar que existan las entidades relacionadas
    await this.validateRelatedEntities(createHorarioDto);
    
    // Verificar conflictos de horario
    await this.validateNoConflicts(createHorarioDto);

    const horario = this.horarioRepository.create(createHorarioDto);
    return this.horarioRepository.save(horario);
  }

  async findAll(): Promise<Horario[]> {
    return this.horarioRepository.find({
      relations: ['grupo', 'profesor', 'profesor.usuario', 'aula'],
      where: { activo: true },
      order: { dia: 'ASC', horaInicio: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Horario> {
    const horario = await this.horarioRepository.findOne({
      where: { id, activo: true },
      relations: ['grupo', 'profesor', 'profesor.usuario', 'aula']
    });

    if (!horario) {
      throw new NotFoundException(`Horario con ID ${id} no encontrado`);
    }

    return horario;
  }

  async findByGrupo(grupoId: number): Promise<Horario[]> {
    return this.horarioRepository.find({
      where: { grupoId, activo: true },
      relations: ['profesor', 'profesor.usuario', 'aula'],
      order: { dia: 'ASC', horaInicio: 'ASC' }
    });
  }

  async findByProfesor(profesorId: number): Promise<Horario[]> {
    return this.horarioRepository.find({
      where: { profesorId, activo: true },
      relations: ['grupo', 'aula'],
      order: { dia: 'ASC', horaInicio: 'ASC' }
    });
  }

  async findByAula(aulaId: number): Promise<Horario[]> {
    return this.horarioRepository.find({
      where: { aulaId, activo: true },
      relations: ['grupo', 'profesor', 'profesor.usuario'],
      order: { dia: 'ASC', horaInicio: 'ASC' }
    });
  }

  async update(id: number, updateHorarioDto: UpdateHorarioDto): Promise<Horario> {
    const horario = await this.findOne(id);
    
    // Si se están cambiando datos críticos, validar conflictos
    if (updateHorarioDto.dia || updateHorarioDto.horaInicio || updateHorarioDto.horaFin || 
        updateHorarioDto.profesorId || updateHorarioDto.aulaId) {
      
      const updatedData = { ...horario, ...updateHorarioDto };
      await this.validateNoConflicts(updatedData, id);
    }

    Object.assign(horario, updateHorarioDto);
    return this.horarioRepository.save(horario);
  }

  async remove(id: number): Promise<void> {
    const horario = await this.findOne(id);
    horario.activo = false;
    await this.horarioRepository.save(horario);
  }

  private async validateRelatedEntities(createHorarioDto: CreateHorarioDto): Promise<void> {
    const grupo = await this.grupoRepository.findOne({
      where: { id: createHorarioDto.grupoId, activo: true }
    });
    if (!grupo) {
      throw new NotFoundException('Grupo no encontrado');
    }

    const profesor = await this.profesorRepository.findOne({
      where: { id: createHorarioDto.profesorId, activo: true }
    });
    if (!profesor) {
      throw new NotFoundException('Profesor no encontrado');
    }

    const aula = await this.aulaRepository.findOne({
      where: { id: createHorarioDto.aulaId, activa: true }
    });
    if (!aula) {
      throw new NotFoundException('Aula no encontrada');
    }
  }

  private async validateNoConflicts(horarioData: any, excludeId?: number): Promise<void> {
    const conflicts = await this.checkConflicts(
      horarioData.dia,
      horarioData.horaInicio,
      horarioData.horaFin,
      excludeId
    );

    const profesorConflict = conflicts.find(c => c.profesor?.id === horarioData.profesorId);
    if (profesorConflict) {
      throw new ConflictException(`El profesor ya tiene clase asignada en este horario: ${profesorConflict.materia}`);
    }

    const aulaConflict = conflicts.find(c => c.aula?.id === horarioData.aulaId);
    if (aulaConflict) {
      throw new ConflictException(`El aula ya está ocupada en este horario por: ${aulaConflict.materia}`);
    }
  }

  async checkConflicts(dia: string, horaInicio: string, horaFin: string, excludeId?: number): Promise<Horario[]> {
    const query = this.horarioRepository.createQueryBuilder('horario')
      .leftJoinAndSelect('horario.profesor', 'profesor')
      .leftJoinAndSelect('profesor.usuario', 'usuario')
      .leftJoinAndSelect('horario.aula', 'aula')
      .leftJoinAndSelect('horario.grupo', 'grupo')
      .where('horario.dia = :dia', { dia })
      .andWhere('horario.activo = true')
      .andWhere(`
        (horario.horaInicio < :horaFin AND horario.horaFin > :horaInicio)
      `, { horaInicio, horaFin });

    if (excludeId) {
      query.andWhere('horario.id != :excludeId', { excludeId });
    }

    return query.getMany();
  }
}