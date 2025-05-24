import { Injectable, NotFoundException, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Alumno } from '../entities/alumno.entity';
import { Horario } from '../entities/horario.entity';
import { CreateAlumnoDto } from '../dto/create-alumno.dto';
import { PasswordValidator } from '../../auth/password.validator';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AlumnosService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Alumno)
    private alumnoRepository: Repository<Alumno>,
    @InjectRepository(Horario)
    private horarioRepository: Repository<Horario>,
  ) {}

  async create(createAlumnoDto: CreateAlumnoDto): Promise<Alumno> {
    try {
      // Validar email y username por separado
      const existingEmail = await this.usersRepository.findOne({
        where: { email: createAlumnoDto.email },
      });

      if (existingEmail) {
        throw new ConflictException('El email ya está registrado');
      }

      const existingUsername = await this.usersRepository.findOne({
        where: { username: createAlumnoDto.username },
      });

      if (existingUsername) {
        throw new ConflictException('El nombre de usuario ya está en uso');
      }

      // Verificar matrícula única
      const existingMatricula = await this.alumnoRepository.findOne({
        where: { matricula: createAlumnoDto.matricula }
      });

      if (existingMatricula) {
        throw new ConflictException('Ya existe un alumno con esta matrícula');
      }

      if (createAlumnoDto.password !== createAlumnoDto.confirmPassword) {
        throw new BadRequestException('Las contraseñas no coinciden');
      }

      PasswordValidator.validate(createAlumnoDto.password);

      const hashedPassword = await bcrypt.hash(createAlumnoDto.password, 10);

      // Crear usuario base
      const { confirmPassword, matricula, grupoId, ...userData } = createAlumnoDto;
      
      const user = this.usersRepository.create({
        ...userData,
        password: hashedPassword,
        isEmailConfirmed: false,
      });

      const savedUser = await this.usersRepository.save(user);

      // Crear el registro específico de alumno
      const alumno = this.alumnoRepository.create({
        matricula: createAlumnoDto.matricula,
        userId: savedUser.id,
        grupoId: createAlumnoDto.grupoId || null,
      });

      return await this.alumnoRepository.save(alumno);
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear el alumno');
    }
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

  async update(id: number, updateData: Partial<CreateAlumnoDto>): Promise<Alumno> {
    const alumno = await this.findOne(id);
    
    // Si se está cambiando la matrícula, verificar que no exista
    if (updateData.matricula && updateData.matricula !== alumno.matricula) {
      const existingAlumno = await this.alumnoRepository.findOne({
        where: { matricula: updateData.matricula }
      });

      if (existingAlumno) {
        throw new ConflictException('Ya existe un alumno con esta matrícula');
      }
      
      alumno.matricula = updateData.matricula;
    }

    // Actualizar grupo si se proporciona
    if (updateData.grupoId !== undefined) {
      alumno.grupoId = updateData.grupoId;
    }

    // Actualizar datos del usuario si se proporcionan
    if (updateData.nombre || updateData.apellidoPaterno || updateData.apellidoMaterno || updateData.email) {
      await this.usersRepository.update(alumno.userId, {
        nombre: updateData.nombre,
        apellidoPaterno: updateData.apellidoPaterno,
        apellidoMaterno: updateData.apellidoMaterno,
        email: updateData.email
      });
    }

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