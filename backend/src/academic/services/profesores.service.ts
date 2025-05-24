// backend/src/academic/services/profesores.service.ts
import { Injectable, NotFoundException, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Profesor } from '../entities/profesor.entity';
import { CreateProfesorDto } from '../dto/create-profesor.dto';
import { PasswordValidator } from '../../auth/password.validator';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfesoresService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Profesor)
    private profesorRepository: Repository<Profesor>,
  ) {}

  async create(createProfesorDto: CreateProfesorDto): Promise<Profesor> {
    try {
      // Validar email y username por separado
      const existingEmail = await this.usersRepository.findOne({
        where: { email: createProfesorDto.email },
      });

      if (existingEmail) {
        throw new ConflictException('El email ya está registrado');
      }

      const existingUsername = await this.usersRepository.findOne({
        where: { username: createProfesorDto.username },
      });

      if (existingUsername) {
        throw new ConflictException('El nombre de usuario ya está en uso');
      }

      // Verificar que no exista otro profesor con el mismo ID
      const existingProfesor = await this.profesorRepository.findOne({
        where: { idProfesor: createProfesorDto.idProfesor }
      });

      if (existingProfesor) {
        throw new ConflictException('Ya existe un profesor con este ID de profesor');
      }

      if (createProfesorDto.password !== createProfesorDto.confirmPassword) {
        throw new BadRequestException('Las contraseñas no coinciden');
      }

      // Validar requisitos de contraseña
      PasswordValidator.validate(createProfesorDto.password);

      const hashedPassword = await bcrypt.hash(createProfesorDto.password, 10);

      // Crear usuario base
      const { confirmPassword, idProfesor, ...userData } = createProfesorDto;
      
      const user = this.usersRepository.create({
        ...userData,
        password: hashedPassword,
        isEmailConfirmed: false,
      });

      const savedUser = await this.usersRepository.save(user);

      // Crear el registro específico de profesor
      const profesor = this.profesorRepository.create({
        idProfesor: createProfesorDto.idProfesor,
        userId: savedUser.id,
      });

      return await this.profesorRepository.save(profesor);
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear el profesor');
    }
  }
async getHorariosDelProfesor(profesorId: number): Promise<any> {
  const profesor = await this.findOne(profesorId);
  
  const horariosActivos = profesor.horarios.filter(h => h.activo);
  
  return {
    profesor: {
      id: profesor.id,
      idProfesor: profesor.idProfesor,
      nombre: `${profesor.usuario.nombre} ${profesor.usuario.apellidoPaterno}`
    },
    horarios: horariosActivos.map(horario => ({
      id: horario.id,
      dia: horario.dia,
      horaInicio: horario.horaInicio,
      horaFin: horario.horaFin,
      materia: horario.materia,
      grupo: horario.grupo.nombre,
      aula: horario.aula.numero
    }))
  };
}
  async findAll(): Promise<Profesor[]> {
    return this.profesorRepository.find({
      where: { activo: true },
      relations: ['usuario', 'horarios', 'horarios.grupo'],
      order: { idProfesor: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Profesor> {
    const profesor = await this.profesorRepository.findOne({
      where: { id, activo: true },
      relations: ['usuario', 'horarios', 'horarios.grupo', 'horarios.aula', 'asistencias']
    });

    if (!profesor) {
      throw new NotFoundException(`Profesor con ID ${id} no encontrado`);
    }

    return profesor;
  }

  async findByIdProfesor(idProfesor: string): Promise<Profesor> {
    const profesor = await this.profesorRepository.findOne({
      where: { idProfesor, activo: true },
      relations: ['usuario', 'horarios']
    });

    if (!profesor) {
      throw new NotFoundException(`Profesor con ID ${idProfesor} no encontrado`);
    }

    return profesor;
  }

  async update(id: number, updateProfesorDto: Partial<CreateProfesorDto>): Promise<Profesor> {
    const profesor = await this.findOne(id);
    
    // Si se está cambiando el idProfesor, verificar que no exista
    if (updateProfesorDto.idProfesor && updateProfesorDto.idProfesor !== profesor.idProfesor) {
      const existingProfesor = await this.profesorRepository.findOne({
        where: { idProfesor: updateProfesorDto.idProfesor }
      });

      if (existingProfesor) {
        throw new ConflictException('Ya existe un profesor con este ID');
      }
      
      profesor.idProfesor = updateProfesorDto.idProfesor;
    }

    // Actualizar datos del usuario si se proporcionan
    if (updateProfesorDto.nombre || updateProfesorDto.apellidoPaterno || updateProfesorDto.apellidoMaterno || updateProfesorDto.email) {
      await this.usersRepository.update(profesor.userId, {
        nombre: updateProfesorDto.nombre,
        apellidoPaterno: updateProfesorDto.apellidoPaterno,
        apellidoMaterno: updateProfesorDto.apellidoMaterno,
        email: updateProfesorDto.email
      });
    }

    return this.profesorRepository.save(profesor);
  }

  async remove(id: number): Promise<void> {
    const profesor = await this.findOne(id);
    
    // Soft delete - marcar como inactivo
    profesor.activo = false;
    await this.profesorRepository.save(profesor);
  }

  async getProfesoresDisponibles(): Promise<Profesor[]> {
    const profesores = await this.profesorRepository.find({
      where: { activo: true },
      relations: ['usuario', 'horarios']
    });

    // Filtrar profesores que tengan menos de un límite de horas (ej: 20 horas/semana)
    return profesores.filter(profesor => profesor.horarios.filter(h => h.activo).length < 20);
  }

  async getEstadisticasCarga(): Promise<any[]> {
    const profesores = await this.profesorRepository.find({
      where: { activo: true },
      relations: ['usuario', 'horarios', 'horarios.grupo']
    });

    return profesores.map(profesor => ({
      id: profesor.id,
      idProfesor: profesor.idProfesor,
      nombre: `${profesor.usuario.nombre} ${profesor.usuario.apellidoPaterno}`,
      horasAsignadas: profesor.horarios.filter(h => h.activo).length,
      gruposAsignados: [...new Set(profesor.horarios.filter(h => h.activo).map(h => h.grupo.nombre))],
      materias: [...new Set(profesor.horarios.filter(h => h.activo).map(h => h.materia))]
    })).sort((a, b) => b.horasAsignadas - a.horasAsignadas);
  }

  async getProfesoresByMateria(materia: string): Promise<Profesor[]> {
    return this.profesorRepository
      .createQueryBuilder('profesor')
      .leftJoinAndSelect('profesor.usuario', 'usuario')
      .leftJoinAndSelect('profesor.horarios', 'horarios')
      .where('profesor.activo = :activo', { activo: true })
      .andWhere('horarios.materia = :materia', { materia })
      .andWhere('horarios.activo = :horarioActivo', { horarioActivo: true })
      .getMany();
  }

  async getCargaHoraria(profesorId: number): Promise<any> {
    const profesor = await this.findOne(profesorId);
    
    const horariosActivos = profesor.horarios.filter(h => h.activo);
    
    return {
      profesor: {
        id: profesor.id,
        idProfesor: profesor.idProfesor,
        nombre: `${profesor.usuario.nombre} ${profesor.usuario.apellidoPaterno}`
      },
      totalHoras: horariosActivos.length,
      horariosPorDia: this.agruparHorariosPorDia(horariosActivos),
      materias: [...new Set(horariosActivos.map(h => h.materia))],
      grupos: [...new Set(horariosActivos.map(h => h.grupo.nombre))]
    };
  }

  private agruparHorariosPorDia(horarios: any[]): any {
    const horariosPorDia = {
      lunes: [],
      martes: [],
      miercoles: [],
      jueves: [],
      viernes: [],
      sabado: [],
      domingo: []
    };

    horarios.forEach(horario => {
      if (horariosPorDia[horario.dia.toLowerCase()]) {
        horariosPorDia[horario.dia.toLowerCase()].push({
          id: horario.id,
          materia: horario.materia,
          horaInicio: horario.horaInicio,
          horaFin: horario.horaFin,
          grupo: horario.grupo.nombre,
          aula: horario.aula.numero
        });
      }
    });

    return horariosPorDia;
  }
}