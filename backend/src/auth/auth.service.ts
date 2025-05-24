// backend/src/auth/auth.service.ts - CORREGIDO
import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EmailService } from './email.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}    

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  async register(createUserDto: any) {
    this.logger.debug(`🔐 Registrando usuario: ${createUserDto.email}`);
    
    // Validar que las contraseñas coincidan ANTES de hashear
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    // Generar token de confirmación
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    this.logger.debug(`🔒 Contraseña hasheada correctamente`);
    
    // Crear usuario con token de confirmación
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
      confirmationToken,
      isEmailConfirmed: createUserDto.isEmailConfirmed || false,
    });

    this.logger.debug(`✅ Usuario registrado: ${user.id} - ${user.email} - ${user.rol}`);

    // Enviar email de confirmación (opcional)
    try {
      await this.emailService.sendConfirmationEmail(user.email, confirmationToken);
      this.logger.debug('📧 Email de confirmación enviado');
    } catch (error) {
      this.logger.warn(`⚠️ No se pudo enviar email: ${error.message}`);
    }

    return { 
      message: 'Usuario registrado exitosamente',
      userId: user.id,
      rol: user.rol
    };
  }

  async confirmEmail(token: string) {
    try {
      const user = await this.usersService.findByConfirmationToken(token);
      
      if (!user) {
        throw new UnauthorizedException('Token de verificación inválido');
      }

      await this.usersService.update(user.id, {
        isEmailConfirmed: true,
        confirmationToken: null,
      });

      return { message: 'Email verificado correctamente' };
    } catch (error) {
      this.logger.error('Error en confirmación de email:', error);
      throw error;
    }
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      return { message: 'Si el email existe, recibirás un enlace para restablecer tu contraseña' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetExpires = new Date();
    passwordResetExpires.setHours(passwordResetExpires.getHours() + 1);

    await this.usersService.update(user.id, {
      passwordResetToken: resetToken,
      passwordResetExpires,
    });

    await this.emailService.sendPasswordResetEmail(email, resetToken);

    return { message: 'Si el email existe, recibirás un enlace para restablecer tu contraseña' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(token);
    
    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.usersService.update(user.id, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null
    });

    return { message: 'Contraseña actualizada correctamente' };
  }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      this.logger.debug(`🔍 Validando usuario: ${email}`);
      const user = await this.usersService.findByEmail(email);

      this.logger.debug(`👤 Usuario encontrado:`, {
        id: user?.id,
        email: user?.email,
        rol: user?.rol,
        hasPassword: !!user?.password
      });

      if (!user) {
        this.logger.debug(`❌ Usuario no encontrado: ${email}`);
        throw new UnauthorizedException('Credenciales inválidas');
      }

      this.logger.debug(`🔐 Comparando contraseñas...`);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        this.logger.debug(`❌ Contraseña incorrecta para: ${email}`);
        throw new UnauthorizedException('Credenciales inválidas');
      }

      this.logger.debug(`✅ Validación exitosa para: ${email}`);
      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      this.logger.error(`💥 Error en validación:`, error.message);
      throw error;
    }
  }

  async login(loginDto: { email: string; password: string }) {
    this.logger.debug(`🚀 Login para: ${loginDto.email}`);
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const payload = {
      email: user.email,
      sub: user.id,
      username: user.username,
      nombre: user.nombre,
      rol: user.rol
    };

    const token = this.jwtService.sign(payload);
    this.logger.debug(`🎫 Token generado para: ${user.email}`);

    return {
      access_token: token,
      token: token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        nombre: user.nombre,
        apellidoPaterno: user.apellidoPaterno,
        apellidoMaterno: user.apellidoMaterno,
        rol: user.rol
      }
    };
  }
}