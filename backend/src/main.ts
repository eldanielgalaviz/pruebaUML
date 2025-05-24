// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar prefijo global para la API
  app.setGlobalPrefix('api');
  
  // Habilitar CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:4200'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Validación global
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: false,
  }));

  const port = process.env.PORT || 3005;
  await app.listen(port);
  
  console.log(`🚀 Backend server running on http://localhost:${port}`);
  console.log(`📊 API disponible en http://localhost:${port}/api`);
  console.log(`📝 Endpoint de registro: http://localhost:${port}/api/auth/register`);
}
bootstrap();