-- Archivo: 04_seed_data.sql
-- Insertar datos iniciales (ejemplo: un administrador)
-- Asegúrate de hashear las contraseñas en la aplicación NestJS antes de insertarlas en la base de datos.

-- Crear un usuario administrador
INSERT INTO usuarios (nombre, email, password, rol) VALUES ('Admin User', 'admin@example.com', 'hashed_password_here', 'administrador');

-- Obtener el ID del usuario administrador recién creado
--Esto podría hacerse mejor con una consulta SELECT que retorna el ID recien insertado.
--SELECT id FROM usuarios WHERE email = 'admin@example.com';

-- Crear un administrador asociado al usuario
--El usuario_id debe ser reemplazado con el ID obtenido.
INSERT INTO administradores (usuario_id) VALUES (1);

-- Crear un usuario profesor
INSERT INTO usuarios (nombre, email, password, rol) VALUES ('Profesor User', 'profesor@example.com', 'hashed_password_here', 'profesor');

-- Obtener el ID del usuario profesor recién creado
--Esto podría hacerse mejor con una consulta SELECT que retorna el ID recien insertado.
--SELECT id FROM usuarios WHERE email = 'profesor@example.com';

-- Crear un profesor asociado al usuario
--El usuario_id debe ser reemplazado con el ID obtenido.
INSERT INTO profesores (id_profesor, usuario_id) VALUES ('PROF001', 2);

-- Crear un usuario alumno
INSERT INTO usuarios (nombre, email, password, rol) VALUES ('Alumno User', 'alumno@example.com', 'hashed_password_here', 'alumno');

-- Obtener el ID del usuario alumno recién creado
--Esto podría hacerse mejor con una consulta SELECT que retorna el ID recien insertado.
--SELECT id FROM usuarios WHERE email = 'alumno@example.com';

-- Crear un alumno asociado al usuario
--El usuario_id debe ser reemplazado con el ID obtenido.
INSERT INTO alumnos (matricula, usuario_id) VALUES ('ALUM001', 3);

-- Crear un grupo
INSERT INTO grupos (id_grupo, nombre) VALUES ('G001', 'Grupo A');

-- Crear un horario
INSERT INTO horarios (id_horario, dia, hora_inicio, hora_fin, aula) VALUES ('H001', 'Lunes', '08:00', '09:00', 'A101');

-- Asignar el alumno al grupo
INSERT INTO alumnos_grupos (alumno_id, grupo_id) VALUES (1, 1);

-- Asignar el profesor al grupo
INSERT INTO profesores_grupos (profesor_id, grupo_id) VALUES (1, 1);

-- Asignar el horario al grupo
INSERT INTO grupos_horarios (grupo_id, horario_id) VALUES (1, 1);