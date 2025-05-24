// src/users/users.service.ts
import { Injectable, ConflictException, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, Not } from 'typeorm';
import { User } from './entities/user.entity';
import { Alumno } from './entities/alumno.entity';
import { JefeGrupo } from './entities/jefe-grupo.entity';
import { Profesor } from './entities/profesor.entity';
import { Checador } from './entities/checador.entity';
import { Administrador } from './entities/administrador.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { PasswordValidator } from '../auth/password.validator';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Alumno)
    private alumnoRepository: Repository<Alumno>,
    @InjectRepository(JefeGrupo)
    private jefeGrupoRepository: Repository<JefeGrupo>,
    @InjectRepository(Profesor)
    private profesorRepository: Repository<Profesor>,
    @InjectRepository(Checador)
    private checadorRepository: Repository<Checador>,
    @InjectRepository(Administrador)
    private administradorRepository: Repository<Administrador>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Validar email y username por separado para dar mensajes más específicos
      const existingEmail = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingEmail) {
        throw new ConflictException('El email ya está registrado');
      }

      const existingUsername = await this.usersRepository.findOne({
        where: { username: createUserDto.username },
      });

      if (existingUsername) {
        throw new ConflictException('El nombre de usuario ya está en uso');
      }

      if (createUserDto.password !== createUserDto.confirmPassword) {
        throw new BadRequestException('Las contraseñas no coinciden');
      }

      // Validar requisitos de contraseña
      PasswordValidator.validate(createUserDto.password);

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      // Eliminar confirmPassword antes de crear el usuario
      const { confirmPassword, ...userData } = createUserDto;
      
      const user = this.usersRepository.create({
        ...userData,
        password: hashedPassword,
        isEmailConfirmed: false,
      });

      return await this.usersRepository.save(user);
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear el usuario');
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ 
        where: { id },
        select: ['id', 'email', 'username', 'nombre', 'apellidoPaterno', 'apellidoMaterno', 'fechaNacimiento', 'isEmailConfirmed']
      });
      
      if (!user) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }
      
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al buscar el usuario');
    }
  }

  async findByUsername(username: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ 
        where: { username }, 
        select: ['id', 'email', 'username', 'password', 'nombre', 'isEmailConfirmed'] 
      });
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al buscar el usuario');
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al buscar el usuario');
    }
  }

  async findByConfirmationToken(token: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ 
        where: { confirmationToken: token } 
      });
      
      if (!user) {
        throw new NotFoundException('Token de confirmación inválido');
      }
      
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al verificar el token');
    }
  }

  async findByResetToken(token: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ 
        where: { 
          passwordResetToken: token,
          passwordResetExpires: MoreThan(new Date())
        } 
      });
      
      if (!user) {
        throw new NotFoundException('Token de recuperación inválido o expirado');
      }
      
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al verificar el token');
    }
  }

  async update(id: number, updateData: Partial<User>): Promise<void> {
    try {
      const result = await this.usersRepository.update(id, updateData);
      
      if (result.affected === 0) {
        throw new NotFoundException('Usuario no encontrado');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al actualizar el usuario');
    }
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<User> {
    try {
      // Si se actualiza el username, verificar que no esté en uso
      if (updateProfileDto.username) {
        const existingUser = await this.usersRepository.findOne({
          where: { 
            username: updateProfileDto.username,
            id: Not(userId)
          }
        });

        if (existingUser) {
          throw new ConflictException('El nombre de usuario ya está en uso');
        }
      }

      await this.usersRepository.update(userId, updateProfileDto);

      const updatedUser = await this.usersRepository.findOne({
        where: { id: userId },
        select: ['id', 'username', 'nombre', 'apellidoPaterno', 'apellidoMaterno', 'fechaNacimiento']
      });

      if (!updatedUser) {
        throw new NotFoundException('Usuario no encontrado');
      }

      return updatedUser;
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al actualizar el perfil');
    }
  }

  // Métodos específicos para tipos de usuario
  async createAlumno(createAlumnoDto: CreateAlumnoDto): Promise<Alumno> {
    try {
      // Primero crear el usuario base
      const userData = {
        username: createAlumnoDto.username,
        email: createAlumnoDto.email,
        password: createAlumnoDto.password,
        confirmPassword: createAlumnoDto.confirmPassword,
        nombre: createAlumnoDto.nombre,
        apellidoPaterno: createAlumnoDto.apellidoPaterno,
        apellidoMaterno: createAlumnoDto.apellidoMaterno,
        fechaNacimiento: createAlumnoDto.fechaNacimiento,
      };

      const user = await this.create(userData);

      // Crear el registro específico de alumno
      const alumno = this.alumnoRepository.create({
        matricula: createAlumnoDto.matricula,
        userId: user.id,
        grupoId: createAlumnoDto.grupoId || null,
      });

      return await this.alumnoRepository.save(alumno);
    } catch (error) {
      throw error;
    }
  }

  async findAllAlumnos(): Promise<Alumno[]> {
    return this.alumnoRepository.find({
      relations: ['usuario', 'grupo']
    });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'username', 'email', 'nombre', 'apellidoPaterno', 'apellidoMaterno', 'fechaNacimiento', 'createdAt']
    });
  }

  async remove(id: number): Promise<void> {
    try {
      const user = await this.findOne(id);
      await this.usersRepository.remove(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al eliminar el usuario');
    }
  }
}