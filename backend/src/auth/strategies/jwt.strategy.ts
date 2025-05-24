import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UsersService,
    private configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'secretKey'),
    });
  }

  async validate(payload: any) {
    console.log('JWT Strategy - Payload recibido:', payload);
    
    try {
      const user = await this.userService.findOne(payload.sub);
      console.log('JWT Strategy - Usuario encontrado:', { id: user.id, email: user.email, rol: user.rol });
      
      return { 
        userId: payload.sub, 
        email: payload.email,
        username: payload.username,
        nombre: payload.nombre,
        rol: user.rol,
        ...user 
      };
    } catch (error) {
      console.error('JWT Strategy - Error al buscar usuario:', error);
      throw new UnauthorizedException('Usuario no válido');
    }
  }
}