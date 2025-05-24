// backend/src/users/users.service.ts - VERSIÓN COMPLETA CORREGIDA
import { Injectable, ConflictException, NotFoundException, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, Not } from 'typeorm';
import { User, UserRole } from './entities/user.entity'; // ✅ Importar UserRole
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
  private readonly logger = new Logger(UsersService.name); // ✅ Agregar logger

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

  // ✅ MÉTODO CORREGIDO - findByEmail
  async findByEmail(email: string): Promise<User | null> {
    try {
      this.logger.debug(`🔍 Buscando usuario por email: ${email}`);
      
      const user = await this.usersRepository.findOne({ 
        where: { email },
        select: [
          'id', 
          'email', 
          'username', 
          'password', 
          'nombre', 
          'apellidoPaterno', 
          'apellidoMaterno', 
          'rol', 
          'isEmailConfirmed',
          'fechaNacimiento',
          'createdAt'
        ] 
      });

      if (user) {
        this.logger.debug(`✅ Usuario encontrado:`, {
          id: user.id,
          email: user.email,
          username: user.username,
          nombre: user.nombre,
          rol: user.rol,
          isEmailConfirmed: user.isEmailConfirmed
        });
      } else {
        this.logger.debug(`❌ Usuario NO encontrado para email: ${email}`);
      }
      
      return user;
    } catch (error) {
      this.logger.error(`💥 Error al buscar usuario por email:`, error);
      throw new InternalServerErrorException('Error al buscar el usuario por email');
    }
  }

  // ✅ MÉTODO CORREGIDO - create
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      this.logger.debug(`🆕 Creando usuario:`, {
        username: createUserDto.username,
        email: createUserDto.email,
        rol: createUserDto.rol
      });

      // Validar email y username por separado
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

      // Eliminar confirmPassword antes de crear el usuario
      const { confirmPassword, ...userData } = createUserDto;
      
      const user = this.usersRepository.create({
        ...userData,
        isEmailConfirmed: userData.isEmailConfirmed || false,
      });

      const savedUser = await this.usersRepository.save(user);
      
      this.logger.debug(`✅ Usuario creado exitosamente:`, {
        id: savedUser.id,
        email: savedUser.email,
        rol: savedUser.rol
      });

      return savedUser;
    } catch (error) {
      this.logger.error(`💥 Error al crear usuario:`, error);
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
        select: ['id', 'email', 'username', 'nombre', 'apellidoPaterno', 'apellidoMaterno', 'fechaNacimiento', 'rol', 'isEmailConfirmed']
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

  // ✅ MÉTODO AGREGADO - findAll
  async findAll(): Promise<User[]> {
    try {
      return await this.usersRepository.find({
        select: ['id', 'username', 'email', 'nombre', 'apellidoPaterno', 'apellidoMaterno', 'fechaNacimiento', 'rol', 'createdAt']
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los usuarios');
    }
  }

  // ✅ MÉTODO AGREGADO - remove
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

  async findByUsername(username: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ 
        where: { username }, 
        select: ['id', 'email', 'username', 'password', 'nombre', 'rol', 'isEmailConfirmed'] 
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

  // ✅ MÉTODO CREATEALUMNO CORREGIDO
  async createAlumno(createAlumnoDto: CreateAlumnoDto): Promise<Alumno> {
    try {
      this.logger.debug(`🎓 Creando alumno:`, {
        username: createAlumnoDto.username,
        email: createAlumnoDto.email,
        matricula: createAlumnoDto.matricula
      });

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

      // Verificar que no exista otro alumno con la misma matrícula
      const existingMatricula = await this.alumnoRepository.findOne({
        where: { matricula: createAlumnoDto.matricula }
      });

      if (existingMatricula) {
        throw new ConflictException('Ya existe un alumno con esta matrícula');
      }

      // Validar que las contraseñas coincidan
      if (createAlumnoDto.password !== createAlumnoDto.confirmPassword) {
        throw new BadRequestException('Las contraseñas no coinciden');
      }

      // Validar requisitos de contraseña
      PasswordValidator.validate(createAlumnoDto.password);

      // ✅ HASHEAR LA CONTRASEÑA CORRECTAMENTE
      const hashedPassword = await bcrypt.hash(createAlumnoDto.password, 10);
      this.logger.debug(`🔒 Contraseña hasheada para alumno`);

      // Crear usuario base con contraseña hasheada
      const userData = {
        username: createAlumnoDto.username,
        email: createAlumnoDto.email,
        password: hashedPassword, // ✅ Usar contraseña hasheada
        nombre: createAlumnoDto.nombre,
        apellidoPaterno: createAlumnoDto.apellidoPaterno,
        apellidoMaterno: createAlumnoDto.apellidoMaterno,
        fechaNacimiento: createAlumnoDto.fechaNacimiento,
        rol: UserRole.ALUMNO, // ✅ Asegurar que el rol sea correcto
        isEmailConfirmed: true // ✅ Para facilitar el testing
      };

      // Crear el usuario SIN usar el método create() para evitar doble hashing
      const user = this.usersRepository.create(userData);
      const savedUser = await this.usersRepository.save(user);

      this.logger.debug(`✅ Usuario base creado para alumno:`, {
        id: savedUser.id,
        email: savedUser.email,
        rol: savedUser.rol
      });

      // Crear el registro específico de alumno
      const alumno = this.alumnoRepository.create({
        matricula: createAlumnoDto.matricula,
        userId: savedUser.id,
        grupoId: createAlumnoDto.grupoId || null,
        activo: true
      });

      const savedAlumno = await this.alumnoRepository.save(alumno);

      this.logger.debug(`✅ Alumno creado exitosamente:`, {
        id: savedAlumno.id,
        matricula: savedAlumno.matricula,
        userId: savedAlumno.userId
      });

      return savedAlumno;
    } catch (error) {
      this.logger.error(`💥 Error al crear alumno:`, error);
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear el alumno');
    }
  }

  // ✅ MÉTODO AGREGADO - findAllAlumnos
  async findAllAlumnos(): Promise<Alumno[]> {
    try {
      return await this.alumnoRepository.find({
        relations: ['usuario', 'grupo'],
        where: { activo: true }
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los alumnos');
    }
  }

  // ✅ MÉTODO PARA RESET DE CONTRASEÑA (ÚTIL PARA TESTING)
  async resetUserPassword(userId: number, newPassword: string): Promise<void> {
    try {
      this.logger.debug(`🔄 Reseteando contraseña para usuario ID: ${userId}`);
      
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await this.usersRepository.update(userId, {
        password: hashedPassword
      });
      
      this.logger.debug(`✅ Contraseña reseteada correctamente`);
    } catch (error) {
      this.logger.error(`💥 Error al resetear contraseña:`, error);
      throw new InternalServerErrorException('Error al resetear contraseña');
    }
  }

  // ✅ MÉTODO DE DEBUG - REMOVER EN PRODUCCIÓN
  async debugUsers(): Promise<any> {
    try {
      const totalUsers = await this.usersRepository.count();
      const users = await this.usersRepository.find({
        select: ['id', 'email', 'username', 'rol'],
        take: 10
      });
      
      return {
        total: totalUsers,
        users: users
      };
    } catch (error) {
      return { error: error.message };
    }
  }
}