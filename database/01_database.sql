-- Archivo: 01_database.sql
-- Crea la base de datos si no existe.
CREATE DATABASE IF NOT EXISTS app_database;

-- Conéctate a la base de datos.  (Opcional, necesario si el siguiente script se ejecuta en un contexto diferente)
-- \c app_database;