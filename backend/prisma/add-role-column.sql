-- Script para agregar la columna role a la tabla usuarios
-- Ejecuta este script en tu base de datos existente

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Actualizar los usuarios existentes con sus roles
UPDATE users SET role = 'admin' WHERE username = 'admin';
UPDATE users SET role = 'manager' WHERE username = 'carlos';
UPDATE users SET role = 'user' WHERE username = 'maria';

-- Confirmación
SELECT 'Columna role agregada exitosamente' AS resultado;
SELECT id, username, role FROM users;
