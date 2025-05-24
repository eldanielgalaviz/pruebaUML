// src/auth/email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    const user = this.configService.get('EMAIL_USER');
    const pass = this.configService.get('EMAIL_PASSWORD');

    this.logger.debug(`Configurando servicio de email con usuario: ${user}`);

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user,
        pass,
      },
      debug: true,
      logger: true,
    });
    this.verifyConnection();
  }

  private async verifyConnection() {
    try {
      await this.transporter.verify();
      this.logger.log('Conexión con el servidor de correo establecida');
    } catch (error) {
      this.logger.error('Error al conectar con el servidor de correo:', error);
    }
  }
  
  async sendConfirmationEmail(to: string, token: string) {
    const frontendUrl = this.configService.get('FRONTEND_URL');
    const verificationLink = `${frontendUrl}/verify-email?token=${token}`;

    this.logger.debug(`Intentando enviar email de confirmación a: ${to}`);
    this.logger.debug(`Link de verificación: ${verificationLink}`);

    try {
      const result = await this.transporter.sendMail({
        from: {
          name: 'UML Generator',
          address: this.configService.get('EMAIL_FROM') || 'generatoruml@gmail.com'
        },
        to,
        subject: 'Confirma tu correo electrónico',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Confirma tu correo electrónico</h2>
            <p>Gracias por registrarte. Por favor, haz clic en el siguiente enlace para confirmar tu correo electrónico:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" 
                 style="background-color: #4CAF50; 
                        color: white; 
                        padding: 12px 25px; 
                        text-decoration: none; 
                        border-radius: 5px;
                        font-weight: bold;">
                Confirmar correo electrónico
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">Si no creaste esta cuenta, puedes ignorar este correo.</p>
          </div>
        `
      });

      this.logger.log(`Email enviado exitosamente a ${to}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al enviar email: ${error.message}`);
      throw error;
    }
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const frontendUrl = this.configService.get('FRONTEND_URL');
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    try {
      await this.transporter.sendMail({
        from: {
          name: 'UML Generator',
          address: this.configService.get('EMAIL_FROM') || 'generatoruml@gmail.com'
        },
        to: to,
        subject: 'Recuperación de contraseña',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Recuperación de contraseña</h2>
            <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background-color: #4CAF50; 
                        color: white; 
                        padding: 12px 25px; 
                        text-decoration: none; 
                        border-radius: 5px;
                        font-weight: bold;">
                Restablecer contraseña
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">Este enlace expirará en 1 hora.</p>
          </div>
        `
      });

      this.logger.log('Email de recuperación enviado a:', to);
    } catch (error) {
      this.logger.error('Error al enviar email de recuperación:', error);
      throw new Error('No se pudo enviar el email de recuperación de contraseña');
    }
  }
}