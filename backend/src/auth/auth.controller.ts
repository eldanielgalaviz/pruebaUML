// backend/src/auth/auth.controller.ts
import { Controller, Request, Post, UseGuards, Body, Get, Query, Logger } from '@nestjs/common';
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
      this.logger.debug('=== REGISTRO DEBUG ===');
      this.logger.debug('Datos recibidos:', JSON.stringify(createUserDto, null, 2));
      this.logger.debug('Tipo de datos:', typeof createUserDto);
      this.logger.debug('Keys:', Object.keys(createUserDto));

      const result = await this.authService.register(createUserDto);
      this.logger.debug('Registro exitoso:', result);
      return result;
    } catch (error) {
      this.logger.error('Error en registro:', error);
      throw error;
    }
  }

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    try {
      this.logger.debug('Login attempt:', { email: loginDto.email });
      return await this.authService.login(loginDto);
    } catch (error) {
      this.logger.error('Error en login:', error);
      throw error;
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
}