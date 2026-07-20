-- Script para insertar datos de prueba en Banco Perú
-- Ejecuta este script después de init-database.sql

-- 1. Insertar usuarios
INSERT INTO users (id, username, email, password, role, "createdAt", "updatedAt") VALUES
('user-1', 'admin', 'admin@bancoperu.com', '$2b$10$YIjT.G5t.L8pQHyR9qRJ9.d2sF6mWvKRo6kR8L5c2Z8X3L4Q1L4Ri', 'admin', NOW(), NOW()),
('user-2', 'carlos', 'carlos@bancoperu.com', '$2b$10$YIjT.G5t.L8pQHyR9qRJ9.d2sF6mWvKRo6kR8L5c2Z8X3L4Q1L4Ri', 'manager', NOW(), NOW()),
('user-3', 'maria', 'maria@bancoperu.com', '$2b$10$YIjT.G5t.L8pQHyR9qRJ9.d2sF6mWvKRo6kR8L5c2Z8X3L4Q1L4Ri', 'user', NOW(), NOW());

-- 2. Insertar clientes
INSERT INTO clients (id, dni, "firstName", "lastName", email, phone, "createdAt", "updatedAt") VALUES
('client-1', '12345678', 'Juan', 'Pérez', 'juan.perez@email.com', '987654321', NOW(), NOW()),
('client-2', '87654321', 'María', 'García', 'maria.garcia@email.com', '987654322', NOW(), NOW()),
('client-3', '11223344', 'Carlos', 'López', 'carlos.lopez@email.com', '987654323', NOW(), NOW()),
('client-4', '55667788', 'Ana', 'Rodríguez', 'ana.rodriguez@email.com', '987654324', NOW(), NOW()),
('client-5', '99887766', 'Pedro', 'Martínez', 'pedro.martinez@email.com', '987654325', NOW(), NOW());

-- 3. Insertar cuentas
INSERT INTO accounts (id, "accountNumber", balance, "clientId", "createdAt", "updatedAt") VALUES
('account-1', '1000001', 5000.00, 'client-1', NOW(), NOW()),
('account-2', '1000002', 3500.50, 'client-2', NOW(), NOW()),
('account-3', '1000003', 10000.00, 'client-3', NOW(), NOW()),
('account-4', '1000004', 2500.75, 'client-4', NOW(), NOW()),
('account-5', '1000005', 7500.25, 'client-5', NOW(), NOW()),
('account-6', '1000006', 1500.00, 'client-1', NOW(), NOW()),
('account-7', '1000007', 8000.00, 'client-2', NOW(), NOW());

-- 4. Insertar transacciones
INSERT INTO transactions (id, amount, "sourceAccountId", "destinationAccountId", "createdAt") VALUES
('trans-1', 500.00, 'account-1', 'account-2', NOW() - INTERVAL '5 days'),
('trans-2', 1000.00, 'account-3', 'account-1', NOW() - INTERVAL '4 days'),
('trans-3', 250.50, 'account-2', 'account-4', NOW() - INTERVAL '3 days'),
('trans-4', 750.00, 'account-5', 'account-3', NOW() - INTERVAL '2 days'),
('trans-5', 300.00, 'account-4', 'account-7', NOW() - INTERVAL '1 day'),
('trans-6', 1200.00, 'account-1', 'account-5', NOW()),
('trans-7', 450.75, 'account-6', 'account-2', NOW());

-- 5. Insertar logs de auditoría
INSERT INTO audit_logs (id, operation, "userId", "entityType", "entityId", details, "createdAt") VALUES
('audit-1', 'CREATE', 'user-1', 'User', 'user-2', '{"action": "Crear usuario", "timestamp": "'||NOW()||'"}', NOW() - INTERVAL '6 days'),
('audit-2', 'CREATE', 'user-1', 'Client', 'client-1', '{"action": "Crear cliente", "name": "Juan Pérez"}', NOW() - INTERVAL '5 days'),
('audit-3', 'CREATE', 'user-2', 'Account', 'account-1', '{"action": "Crear cuenta", "accountNumber": "1000001"}', NOW() - INTERVAL '4 days'),
('audit-4', 'TRANSFER', 'user-2', 'Transaction', 'trans-1', '{"action": "Transferencia realizada", "amount": 500.00}', NOW() - INTERVAL '3 days'),
('audit-5', 'TRANSFER', 'user-3', 'Transaction', 'trans-2', '{"action": "Transferencia realizada", "amount": 1000.00}', NOW() - INTERVAL '2 days'),
('audit-6', 'LOGIN', 'user-2', 'User', 'user-2', '{"action": "Login exitoso", "ip": "192.168.1.100"}', NOW() - INTERVAL '1 day'),
('audit-7', 'TRANSFER', 'user-1', 'Transaction', 'trans-6', '{"action": "Transferencia realizada", "amount": 1200.00}', NOW());

-- Confirmación
SELECT 'Datos insertados exitosamente' AS resultado;
SELECT COUNT(*) as total_usuarios FROM users;
SELECT COUNT(*) as total_clientes FROM clients;
SELECT COUNT(*) as total_cuentas FROM accounts;
SELECT COUNT(*) as total_transacciones FROM transactions;
SELECT COUNT(*) as total_logs FROM audit_logs;
