// backend/src/auth/auth.controller.ts - VERSIÓN COMPLETA
import { Controller, Request, Post, UseGuards, Body, Get, Query, Logger, HttpStatus, HttpException, Param } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      this.logger.debug('=== REGISTRO INICIADO ===');
      this.logger.debug('Body recibido:', JSON.stringify(createUserDto, null, 2));

      // Validaciones básicas
      if (!createUserDto.email || !createUserDto.password) {
        throw new HttpException('Email y password son requeridos', HttpStatus.BAD_REQUEST);
      }

      if (!createUserDto.username) {
        throw new HttpException('Username es requerido', HttpStatus.BAD_REQUEST);
      }

      if (!createUserDto.nombre || !createUserDto.apellidoPaterno) {
        throw new HttpException('Nombre y apellido paterno son requeridos', HttpStatus.BAD_REQUEST);
      }

      // Convertir fecha si viene como string
      if (typeof createUserDto.fechaNacimiento === 'string') {
        createUserDto.fechaNacimiento = new Date(createUserDto.fechaNacimiento);
      }

      const result = await this.authService.register(createUserDto);
      this.logger.debug('✅ Registro exitoso');
      return result;
    } catch (error) {
      this.logger.error('❌ ERROR EN REGISTRO:', error);
      this.logger.error('Stack trace:', error.stack);
      
      if (error instanceof HttpException) {
        throw error;
      }

      // Error genérico para evitar exposición de detalles internos
      throw new HttpException(
        {
          message: 'Error al crear el usuario',
          details: error.message || 'Error interno del servidor'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    try {
      this.logger.debug('=== LOGIN INICIADO ===');
      this.logger.debug('Email:', loginDto.email);
      
      if (!loginDto.email || !loginDto.password) {
        throw new HttpException('Email y password son requeridos', HttpStatus.BAD_REQUEST);
      }
      
      const result = await this.authService.login(loginDto);
      
      this.logger.debug('✅ Login exitoso');
      return result;
    } catch (error) {
      this.logger.error('❌ ERROR EN LOGIN:', error.message);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
    }
  }

  // ✅ ENDPOINT PARA RESETEAR CONTRASEÑA DE USUARIO EXISTENTE
  @Post('reset-user-password')
  async resetUserPassword(@Body() body: { email: string; newPassword: string }) {
    try {
      this.logger.debug(`🔄 Reseteando contraseña para: ${body.email}`);
      
      // Buscar usuario por email
      const user = await this.authService['usersService'].findByEmail(body.email);
      if (!user) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      // Resetear contraseña
      await this.authService['usersService'].resetUserPassword(user.id, body.newPassword);
      
      return { 
        message: 'Contraseña reseteada correctamente',
        email: body.email 
      };
    } catch (error) {
      this.logger.error('Error reseteando contraseña:', error);
      throw new HttpException('Error al resetear contraseña', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ✅ ENDPOINT PARA VER INFO DE USUARIO
  @Get('user-info/:email')
  async getUserInfo(@Param('email') email: string) {
    try {
      const user = await this.authService['usersService'].findByEmail(email);
      if (!user) {
        return { error: 'Usuario no encontrado' };
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        nombre: user.nombre,
        apellidoPaterno: user.apellidoPaterno,
        rol: user.rol,
        isEmailConfirmed: user.isEmailConfirmed,
        hasPassword: !!user.password,
        passwordLength: user.password?.length || 0,
        passwordHash: user.password?.substring(0, 10) + '...' // Solo primeros 10 chars para debug
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  // ✅ ENDPOINT PARA VERIFICAR HASH DE CONTRASEÑA
  @Post('verify-password')
  async verifyPassword(@Body() body: { email: string; password: string }) {
    try {
      const user = await this.authService['usersService'].findByEmail(body.email);
      if (!user) {
        return { error: 'Usuario no encontrado' };
      }

      const bcrypt = await import('bcrypt');
      const isValid = await bcrypt.compare(body.password, user.password);
      
      return {
        email: body.email,
        passwordProvided: body.password,
        storedHashLength: user.password?.length,
        storedHashPrefix: user.password?.substring(0, 20),
        isValidPassword: isValid,
        bcryptTest: await bcrypt.hash(body.password, 10) // Para comparar formato
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('register-simple')
  async registerSimple(@Body() body: any) {
    try {
      this.logger.debug('=== REGISTRO SIMPLE ===');
      this.logger.debug('Datos recibidos:', body);

      // Crear usuario directamente con datos mínimos
      const userData = {
        username: body.username || 'default_user',
        email: body.email,
        password: body.password,
        confirmPassword: body.password,
        nombre: body.nombre || 'Test',
        apellidoPaterno: body.apellidoPaterno || 'User',
        apellidoMaterno: body.apellidoMaterno || 'Test',
        fechaNacimiento: new Date('2000-01-01'),
        rol: body.rol || 'alumno',
        isEmailConfirmed: true
      };

      this.logger.debug('Datos procesados para registro:', userData);

      const result = await this.authService.register(userData);
      return result;
    } catch (error) {
      this.logger.error('Error en registro simple:', error);
      return {
        error: 'Error en registro',
        message: error.message,
        stack: error.stack
      };
    }
  }

  @Get('confirm-email')
  async confirmEmail(@Query('token') token: string) {
    return this.authService.confirmEmail(token);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; password: string }) {
    return this.authService.resetPassword(body.token, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('debug-db')
  async debugDatabase() {
    try {
      // Solo para debug - verificar conexion a BD
      const { UsersService } = await import('../users/users.service');
      return { message: 'Endpoint de debug activo' };
    } catch (error) {
      return { 
        error: 'Error de conexión a BD',
        details: error.message 
      };
    }
  }
}