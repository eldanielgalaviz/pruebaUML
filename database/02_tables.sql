-- Archivo: 02_tables.sql
-- Elimina las tablas si existen para asegurar la idempotencia.
DROP TABLE IF EXISTS asistencias CASCADE;
DROP TABLE IF EXISTS horarios CASCADE;
DROP TABLE IF EXISTS grupos CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS alumnos CASCADE;
DROP TABLE IF EXISTS jefes_grupo CASCADE;
DROP TABLE IF EXISTS profesores CASCADE;
DROP TABLE IF EXISTS checadores CASCADE;
DROP TABLE IF EXISTS administradores CASCADE;
DROP TABLE IF EXISTS alumnos_grupos CASCADE; -- Tabla intermedia para la relación many-to-many entre alumnos y grupos.
DROP TABLE IF EXISTS profesores_grupos CASCADE; -- Tabla intermedia para la relación many-to-many entre profesores y grupos.
DROP TABLE IF EXISTS grupos_horarios CASCADE; -- Tabla intermedia para la relación many-to-many entre grupos y horarios.

-- Tabla: usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    rol TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: alumnos
CREATE TABLE alumnos (
    id SERIAL PRIMARY KEY,
    matricula TEXT NOT NULL UNIQUE,
    usuario_id INTEGER NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla: jefes_grupo
CREATE TABLE jefes_grupo (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL UNIQUE,
    grupo_id INTEGER, -- Jefe de Grupo pertenece a un grupo.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla: profesores
CREATE TABLE profesores (
    id SERIAL PRIMARY KEY,
    id_profesor TEXT NOT NULL UNIQUE,
    usuario_id INTEGER NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla: checadores
CREATE TABLE checadores (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla: administradores
CREATE TABLE administradores (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla: horarios
CREATE TABLE horarios (
    id SERIAL PRIMARY KEY,
    id_horario TEXT NOT NULL UNIQUE,
    dia TEXT NOT NULL,
    hora_inicio TEXT NOT NULL,
    hora_fin TEXT NOT NULL,
    aula TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: grupos
CREATE TABLE grupos (
    id SERIAL PRIMARY KEY,
    id_grupo TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: asistencias
CREATE TABLE asistencias (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    presente BOOLEAN NOT NULL,
    alumno_id INTEGER,
    profesor_id INTEGER,
    horario_id INTEGER,
    grupo_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE SET NULL,  --Permitir alumno no registrado
    FOREIGN KEY (profesor_id) REFERENCES profesores(id) ON DELETE SET NULL, --Permitir profesor no registrado
    FOREIGN KEY (horario_id) REFERENCES horarios(id) ON DELETE SET NULL,   --Permitir horario no registrado
    FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE SET NULL      --Permitir grupo no registrado
);

-- Tabla intermedia: alumnos_grupos (relación many-to-many entre alumnos y grupos)
CREATE TABLE alumnos_grupos (
    alumno_id INTEGER NOT NULL,
    grupo_id INTEGER NOT NULL,
    PRIMARY KEY (alumno_id, grupo_id),
    FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE CASCADE,
    FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE
);

-- Tabla intermedia: profesores_grupos (relación many-to-many entre profesores y grupos)
CREATE TABLE profesores_grupos (
    profesor_id INTEGER NOT NULL,
    grupo_id INTEGER NOT NULL,
    PRIMARY KEY (profesor_id, grupo_id),
    FOREIGN KEY (profesor_id) REFERENCES profesores(id) ON DELETE CASCADE,
    FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE
);

-- Tabla intermedia: grupos_horarios (relación many-to-many entre grupos y horarios)
CREATE TABLE grupos_horarios (
    grupo_id INTEGER NOT NULL,
    horario_id INTEGER NOT NULL,
    PRIMARY KEY (grupo_id, horario_id),
    FOREIGN KEY (grupo_id) REFERENCES grupos(id) ON DELETE CASCADE,
    FOREIGN KEY (horario_id) REFERENCES horarios(id) ON DELETE CASCADE
);

-- Índices para mejorar el rendimiento de las consultas
CREATE INDEX idx_usuarios_email ON usuarios (email);
CREATE INDEX idx_alumnos_matricula ON alumnos (matricula);
CREATE INDEX idx_profesores_id_profesor ON profesores (id_profesor);
CREATE INDEX idx_horarios_id_horario ON horarios (id_horario);
CREATE INDEX idx_grupos_id_grupo ON grupos (id_grupo);