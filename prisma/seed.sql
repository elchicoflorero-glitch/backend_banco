-- =====================================================
-- SCRIPT DE DATOS DE EJEMPLO PARA BANCO_PERU
-- =====================================================

-- 1. INSERTAR USUARIOS
INSERT INTO users (id, username, email, password, role, "createdAt", "updatedAt") VALUES
('user_1', 'admin_user', 'admin@banco.pe', '$2a$10$zR1B1F1F1F1F1F1F1F1F1u', 'admin', NOW(), NOW()),
('user_2', 'carlos_login', 'carlos@banco.pe', '$2a$10$zR1B1F1F1F1F1F1F1F1F1u', 'user', NOW(), NOW()),
('user_3', 'juan_manager', 'juan@banco.pe', '$2a$10$zR1B1F1F1F1F1F1F1F1F1u', 'manager', NOW(), NOW());

-- 2. INSERTAR CLIENTES
INSERT INTO clients (id, user_id, dni, "firstName", "lastName", email, phone, password, "createdAt", "updatedAt") VALUES
('client_1', 'user_2', '12345678', 'Carlos', 'Sánchez', 'carlos.sanchez@email.com', '987654321', '$2a$10$zR1B1F1F1F1F1F1F1F1F1u', NOW(), NOW()),
('client_2', 'user_3', '87654321', 'Juan', 'Pérez', 'juan.perez@email.com', '987123456', '$2a$10$zR1B1F1F1F1F1F1F1F1F1u', NOW(), NOW()),
('client_3', NULL, '11223344', 'María', 'García', 'maria.garcia@email.com', '988765432', '$2a$10$zR1B1F1F1F1F1F1F1F1F1u', NOW(), NOW()),
('client_4', NULL, '55667788', 'Pedro', 'López', 'pedro.lopez@email.com', '989876543', '$2a$10$zR1B1F1F1F1F1F1F1F1F1u', NOW(), NOW());

-- 3. INSERTAR CUENTAS
INSERT INTO accounts (id, "accountNumber", balance, currency, "clientId", "createdAt", "updatedAt") VALUES
('account_1', '0001234567', 5000.00, 'PEN', 'client_1', NOW(), NOW()),
('account_2', '0001234568', 3500.50, 'USD', 'client_1', NOW(), NOW()),
('account_3', '0001234569', 10000.00, 'PEN', 'client_2', NOW(), NOW()),
('account_4', '0001234570', 2500.75, 'EUR', 'client_2', NOW(), NOW()),
('account_5', '0001234571', 15000.00, 'PEN', 'client_3', NOW(), NOW()),
('account_6', '0001234572', 8000.25, 'USD', 'client_4', NOW(), NOW());

-- 4. INSERTAR TRANSACCIONES
INSERT INTO transactions (id, amount, "sourceAccountId", "destinationAccountId", "createdAt") VALUES
('trans_1', 500.00, 'account_1', 'account_3', NOW()),
('trans_2', 250.50, 'account_2', 'account_4', NOW()),
('trans_3', 1000.00, 'account_3', 'account_5', NOW()),
('trans_4', 750.25, 'account_4', 'account_6', NOW()),
('trans_5', 200.00, 'account_5', 'account_1', NOW());

-- 5. INSERTAR LOGS DE AUDITORÍA
INSERT INTO audit_logs (id, operation, "userId", "entityType", "entityId", details, "createdAt") VALUES
('audit_1', 'CREATE_USER', 'user_1', 'USER', 'user_2', '{"action": "Usuario registrado"}', NOW()),
('audit_2', 'CREATE_CLIENT', 'user_2', 'CLIENT', 'client_1', '{"action": "Cliente creado"}', NOW()),
('audit_3', 'CREATE_ACCOUNT', 'user_2', 'ACCOUNT', 'account_1', '{"action": "Cuenta bancaria creada", "currency": "PEN"}', NOW()),
('audit_4', 'TRANSFER', 'user_2', 'TRANSACTION', 'trans_1', '{"action": "Transferencia realizada", "amount": 500.00}', NOW()),
('audit_5', 'CREATE_ACCOUNT', 'user_3', 'ACCOUNT', 'account_3', '{"action": "Cuenta bancaria creada", "currency": "PEN"}', NOW()),
('audit_6', 'TRANSFER', 'user_3', 'TRANSACTION', 'trans_3', '{"action": "Transferencia realizada", "amount": 1000.00}', NOW());

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================
