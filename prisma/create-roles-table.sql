-- Script para crear tabla de roles y actualizar users
-- Este script crea una tabla separada de roles para mejor normalización

-- 1. CREAR TABLA DE ROLES
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. INSERTAR ROLES BASE
INSERT INTO roles (name, description) VALUES
('admin', 'Administrador con acceso total'),
('manager', 'Gerente con acceso a gestión'),
('user', 'Usuario regular')
ON CONFLICT (name) DO NOTHING;

-- 3. AGREGAR COLUMNA role_id A TABLA users (si no existe)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role_id INTEGER;

-- 4. AGREGAR CONSTRAINT DE FOREIGN KEY
ALTER TABLE users
ADD CONSTRAINT fk_users_role_id FOREIGN KEY (role_id) REFERENCES roles(id)
ON DELETE SET NULL;

-- 5. ACTUALIZAR ROLES DE USUARIOS EXISTENTES
UPDATE users SET role_id = (SELECT id FROM roles WHERE name = 'admin') WHERE username = 'admin';
UPDATE users SET role_id = (SELECT id FROM roles WHERE name = 'manager') WHERE username = 'carlos';
UPDATE users SET role_id = (SELECT id FROM roles WHERE name = 'user') WHERE username = 'maria';

-- Para usuarios no especificados, asignar 'user' por defecto
UPDATE users SET role_id = (SELECT id FROM roles WHERE name = 'user') WHERE role_id IS NULL;

-- 6. HACER role_id NOT NULL
ALTER TABLE users
ALTER COLUMN role_id SET NOT NULL;

-- 7. CREAR TABLA DE PERMISOS (para futura extensibilidad)
CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. CREAR TABLA DE RELACIÓN ROLES-PERMISOS
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INTEGER NOT NULL,
    permission_id INTEGER NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- 9. INSERTAR PERMISOS BASE
INSERT INTO permissions (name, description) VALUES
('manage_clients', 'Crear, editar y eliminar clientes'),
('manage_accounts', 'Crear, editar y eliminar cuentas'),
('manage_users', 'Crear y editar usuarios'),
('view_audit_logs', 'Ver logs de auditoría'),
('manage_transfers', 'Hacer transferencias'),
('view_reports', 'Ver reportes'),
('manage_roles', 'Gestionar roles y permisos'),
('view_transactions', 'Ver historial de transacciones')
ON CONFLICT (name) DO NOTHING;

-- 10. ASIGNAR PERMISOS A ADMIN (todos)
DELETE FROM role_permissions WHERE role_id = (SELECT id FROM roles WHERE name = 'admin');
INSERT INTO role_permissions (role_id, permission_id)
SELECT (SELECT id FROM roles WHERE name = 'admin'), id FROM permissions;

-- 11. ASIGNAR PERMISOS A MANAGER
DELETE FROM role_permissions WHERE role_id = (SELECT id FROM roles WHERE name = 'manager');
INSERT INTO role_permissions (role_id, permission_id)
SELECT (SELECT id FROM roles WHERE name = 'manager'), id FROM permissions
WHERE name IN ('manage_clients', 'manage_accounts', 'manage_transfers', 'view_transactions', 'view_reports');

-- 12. ASIGNAR PERMISOS A USER
DELETE FROM role_permissions WHERE role_id = (SELECT id FROM roles WHERE name = 'user');
INSERT INTO role_permissions (role_id, permission_id)
SELECT (SELECT id FROM roles WHERE name = 'user'), id FROM permissions
WHERE name IN ('manage_transfers', 'view_transactions');

-- 13. CREAR ÍNDICES PARA MEJOR RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission ON role_permissions(permission_id);

-- 14. VERIFICACIÓN
SELECT 'Tabla de roles creada exitosamente' AS resultado;
SELECT COUNT(*) as total_roles FROM roles;
SELECT COUNT(*) as total_permisos FROM permissions;
SELECT COUNT(*) as total_relaciones FROM role_permissions;
SELECT u.username, r.name as role FROM users u JOIN roles r ON u.role_id = r.id ORDER BY u.username;
