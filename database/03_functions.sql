-- Archivo: 03_functions.sql
-- Función para actualizar el timestamp 'updated_at' automáticamente.
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para cada tabla que tiene 'updated_at'
CREATE OR REPLACE TRIGGER update_usuarios_updated_at
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

CREATE OR REPLACE TRIGGER update_alumnos_updated_at
BEFORE UPDATE ON alumnos
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

CREATE OR REPLACE TRIGGER update_jefes_grupo_updated_at
BEFORE UPDATE ON jefes_grupo
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

CREATE OR REPLACE TRIGGER update_profesores_updated_at
BEFORE UPDATE ON profesores
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

CREATE OR REPLACE TRIGGER update_checadores_updated_at
BEFORE UPDATE ON checadores
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

CREATE OR REPLACE TRIGGER update_administradores_updated_at
BEFORE UPDATE ON administradores
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

CREATE OR REPLACE TRIGGER update_horarios_updated_at
BEFORE UPDATE ON horarios
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

CREATE OR REPLACE TRIGGER update_grupos_updated_at
BEFORE UPDATE ON grupos
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

CREATE OR REPLACE TRIGGER update_asistencias_updated_at
BEFORE UPDATE ON asistencias
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();