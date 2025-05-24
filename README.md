# Proyecto Generado

Este proyecto ha sido generado automáticamente a partir de diagramas UML y requisitos.

## Estructura del Proyecto

El proyecto se divide en tres partes principales:

### Frontend (Angular)

La carpeta `frontend` contiene un proyecto Angular completo con los siguientes módulos:

- AppModule
- CoreModule
- SharedModule
- AuthModule
- UsersModule

Para ejecutar el frontend:

1. Navega a la carpeta `frontend`
2. Instala las dependencias: `npm install`
3. Inicia el servidor de desarrollo: `ng serve`
4. Abre tu navegador en `http://localhost:4200`

### Backend (NestJS)

La carpeta `backend` contiene un proyecto NestJS completo con los siguientes módulos:

- AuthModule
- UsersModule
- ProjectsModule
- TasksModule

Para ejecutar el backend:

1. Navega a la carpeta `backend`
2. Instala las dependencias: `npm install`
3. Inicia el servidor de desarrollo: `npm run start:dev`
4. El API estará disponible en `http://localhost:3000`

### Base de Datos (PostgreSQL)

La carpeta `database` contiene scripts SQL para crear y configurar la base de datos PostgreSQL.

Para configurar la base de datos:

1. Instala PostgreSQL si aún no lo tienes
2. Crea una nueva base de datos
3. Ejecuta los scripts SQL en el siguiente orden:
   - Primero: script de creación de base de datos
   - Segundo: script de creación de tablas
   - Tercero: script de relaciones
   - Cuarto: script de funciones y triggers
   - Quinto: script de datos iniciales (si existe)

## Configuración

Asegúrate de configurar las variables de entorno en los archivos `.env` en ambos proyectos.

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.
