// backend/src/users/services/aulas.service.ts
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

  async getAulasDisponibles(): Promise<Aula[]> {
    return this.aulaRepository.find({
      where: { activa: true },
      order: { capacidad: 'DESC' }
    });
  }

  async getEstadisticasOcupacion(): Promise<any[]> {
    const aulas = await this.aulaRepository.find({
      where: { activa: true },
      relations: ['horarios']
    });

    return aulas.map(aula => ({
      id: aula.id,
      numero: aula.numero,
      capacidad: aula.capacidad,
      ubicacion: aula.ubicacion,
      horasOcupadas: aula.horarios.filter(h => h.activo).length,
      porcentajeOcupacion: (aula.horarios.filter(h => h.activo).length / 40) * 100 // Asumiendo 40 horas/semana máximo
    })).sort((a, b) => b.porcentajeOcupacion - a.porcentajeOcupacion);
  }
}