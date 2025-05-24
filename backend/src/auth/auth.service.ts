import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EmailService } from './email.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
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
    // Validar que las contraseñas coincidan ANTES de hashear
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    // Generar token de confirmación
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    console.log('Token generado:', confirmationToken);
    
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    console.log('Contraseña hasheada:', hashedPassword);
    
    // Crear usuario con token de confirmación
    const user = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
      confirmationToken,
      isEmailConfirmed: false,
    });
    console.log('Usuario creado:', { id: user.id, email: user.email, rol: user.rol });

    // Enviar email de confirmación (opcional)
    try {
      console.log('Intentando enviar email de confirmación');
      await this.emailService.sendConfirmationEmail(user.email, confirmationToken);
      console.log('Email de confirmación enviado');
    } catch (error) {
      console.warn('No se pudo enviar el email de confirmación:', error.message);
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
      console.error('Error en confirmación de email:', error);
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
      console.log('Intentando validar usuario:', email);
      const user = await this.usersService.findByEmail(email);

      console.log('Usuario encontrado:', { id: user?.id, email: user?.email, rol: user?.rol });
      if (!user) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      console.error('Error en validación:', error);
      throw error;
    }
  }

  async login(loginDto: { email: string; password: string }) {
    console.log('Datos de login recibidos:', loginDto);
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const payload = {
      email: user.email,
      sub: user.id,
      username: user.username,
      nombre: user.nombre,
      rol: user.rol
    };

    const token = this.jwtService.sign(payload);

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