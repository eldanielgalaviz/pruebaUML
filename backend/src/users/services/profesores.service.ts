// backend/src/users/services/profesores.service.ts - CORREGIDO
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
        throw new ConflictException('Ya existe un profesor con este ID');
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

  async findAll(): Promise<Profesor[]> {
    return this.profesorRepository.find({
      where: { activo: true },
      relations: ['usuario', 'horarios', 'horarios.grupo'],
      // CORREGIDO: usar el QueryBuilder para ordenamiento por campos de relación
    });
  }

  // Método alternativo con ordenamiento correcto
  async findAllOrdered(): Promise<Profesor[]> {
    return this.profesorRepository
      .createQueryBuilder('profesor')
      .leftJoinAndSelect('profesor.usuario', 'usuario')
      .leftJoinAndSelect('profesor.horarios', 'horarios')
      .leftJoinAndSelect('horarios.grupo', 'grupo')
      .where('profesor.activo = :activo', { activo: true })
      .orderBy('usuario.apellidoPaterno', 'ASC')
      .getMany();
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

  async update(id: number, updateData: Partial<CreateProfesorDto>): Promise<Profesor> {
    const profesor = await this.findOne(id);
    
    // Si se está cambiando el idProfesor, verificar que no exista
    if (updateData.idProfesor && updateData.idProfesor !== profesor.idProfesor) {
      const existingProfesor = await this.profesorRepository.findOne({
        where: { idProfesor: updateData.idProfesor }
      });

      if (existingProfesor) {
        throw new ConflictException('Ya existe un profesor con este ID');
      }
      
      profesor.idProfesor = updateData.idProfesor;
    }

    // Actualizar datos del usuario si se proporcionan
    if (updateData.nombre || updateData.apellidoPaterno || updateData.apellidoMaterno || updateData.email) {
      await this.usersRepository.update(profesor.userId, {
        nombre: updateData.nombre,
        apellidoPaterno: updateData.apellidoPaterno,
        apellidoMaterno: updateData.apellidoMaterno,
        email: updateData.email
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
}