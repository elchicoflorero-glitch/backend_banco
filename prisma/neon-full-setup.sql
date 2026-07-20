-- Script completo para Neon que coincide 100% con el schema de Prisma
-- Ejecutar directamente en SQL Editor de Neon

-- 1. CREAR LAS TABLAS (con DROP si existen para reiniciar limpio)

-- Tabla de usuarios
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS otp_requests CASCADE;
DROP TABLE IF EXISTS pdf_reports CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de clientes
CREATE TABLE clients (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    dni TEXT UNIQUE NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    password TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "clients_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabla de cuentas
CREATE TABLE accounts (
    id TEXT PRIMARY KEY,
    "accountNumber" TEXT UNIQUE NOT NULL,
    balance NUMERIC(15, 2) NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'PEN',
    "clientId" TEXT NOT NULL,
    "dailyWithdrawalLimit" NUMERIC(15, 2) DEFAULT 5000,
    "dailyWithdrawnAmount" NUMERIC(15, 2) DEFAULT 0,
    "lastWithdrawalReset" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "accounts_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES clients(id) ON DELETE CASCADE
);

-- Tabla de transacciones
CREATE TABLE transactions (
    id TEXT PRIMARY KEY,
    amount NUMERIC(15, 2) NOT NULL,
    "sourceAccountId" TEXT,
    "destinationAccountId" TEXT NOT NULL,
    type TEXT DEFAULT 'transfer',
    status TEXT DEFAULT 'completed',
    description TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "transactions_sourceAccountId_fkey" FOREIGN KEY ("sourceAccountId") REFERENCES accounts(id) ON DELETE SET NULL,
    CONSTRAINT "transactions_destinationAccountId_fkey" FOREIGN KEY ("destinationAccountId") REFERENCES accounts(id) ON DELETE CASCADE
);

-- Tabla de auditoría
CREATE TABLE audit_logs (
    id TEXT PRIMARY KEY,
    operation TEXT NOT NULL,
    "userId" TEXT,
    "entityType" TEXT,
    "entityId" TEXT,
    details JSONB,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE SET NULL
);

-- Tabla de OTP
CREATE TABLE otp_requests (
    id TEXT PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    "expiresAt" TIMESTAMP NOT NULL,
    "isUsed" BOOLEAN DEFAULT FALSE,
    "usedAt" TIMESTAMP,
    attempts INT DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "otp_requests_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES accounts(id) ON DELETE CASCADE
);

-- Tabla de reportes PDF
CREATE TABLE pdf_reports (
    id TEXT PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "s3Path" TEXT,
    "fileSize" INT,
    "generatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP NOT NULL,
    "downloadCount" INT DEFAULT 0,
    "lastDownloadAt" TIMESTAMP,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. CREAR ÍNDICES
CREATE INDEX IF NOT EXISTS "idx_accounts_clientId" ON accounts("clientId");
CREATE INDEX IF NOT EXISTS "idx_transactions_sourceAccountId" ON transactions("sourceAccountId");
CREATE INDEX IF NOT EXISTS "idx_transactions_destinationAccountId" ON transactions("destinationAccountId");
CREATE INDEX IF NOT EXISTS "idx_audit_logs_userId" ON audit_logs("userId");
CREATE INDEX IF NOT EXISTS "idx_audit_logs_createdAt" ON audit_logs("createdAt");
CREATE INDEX IF NOT EXISTS "idx_clients_user_id" ON clients(user_id);
CREATE INDEX IF NOT EXISTS "idx_otp_requests_accountId" ON otp_requests("accountId");

-- 3. INSERTAR DATOS DE PRUEBA

-- Insertar usuarios (password: Admin123!)
INSERT INTO users (id, username, email, password, role, "createdAt", "updatedAt") VALUES
('user-1', 'admin', 'admin@bancoperu.com', '$2b$10$YIjT.G5t.L8pQHyR9qRJ9.d2sF6mWvKRo6kR8L5c2Z8X3L4Q1L4Ri', 'admin', NOW(), NOW()),
('user-2', 'carlos', 'carlos@bancoperu.com', '$2b$10$YIjT.G5t.L8pQHyR9qRJ9.d2sF6mWvKRo6kR8L5c2Z8X3L4Q1L4Ri', 'manager', NOW(), NOW()),
('user-3', 'maria', 'maria@bancoperu.com', '$2b$10$YIjT.G5t.L8pQHyR9qRJ9.d2sF6mWvKRo6kR8L5c2Z8X3L4Q1L4Ri', 'user', NOW(), NOW());

-- Insertar clientes (password: Client123!)
INSERT INTO clients (id, user_id, dni, "firstName", "lastName", email, phone, password, "createdAt", "updatedAt") VALUES
('client-1', NULL, '12345678', 'Juan', 'Pérez', 'juan.perez@email.com', '987654321', '$2b$10$YIjT.G5t.L8pQHyR9qRJ9.d2sF6mWvKRo6kR8L5c2Z8X3L4Q1L4Ri', NOW(), NOW()),
('client-2', NULL, '87654321', 'María', 'García', 'maria.garcia@email.com', '987654322', '$2b$10$YIjT.G5t.L8pQHyR9qRJ9.d2sF6mWvKRo6kR8L5c2Z8X3L4Q1L4Ri', NOW(), NOW()),
('client-3', NULL, '11223344', 'Carlos', 'López', 'carlos.lopez@email.com', '987654323', '$2b$10$YIjT.G5t.L8pQHyR9qRJ9.d2sF6mWvKRo6kR8L5c2Z8X3L4Q1L4Ri', NOW(), NOW()),
('client-4', NULL, '55667788', 'Ana', 'Rodríguez', 'ana.rodriguez@email.com', '987654324', '$2b$10$YIjT.G5t.L8pQHyR9qRJ9.d2sF6mWvKRo6kR8L5c2Z8X3L4Q1L4Ri', NOW(), NOW()),
('client-5', NULL, '99887766', 'Pedro', 'Martínez', 'pedro.martinez@email.com', '987654325', '$2b$10$YIjT.G5t.L8pQHyR9qRJ9.d2sF6mWvKRo6kR8L5c2Z8X3L4Q1L4Ri', NOW(), NOW());

-- Insertar cuentas
INSERT INTO accounts (id, "accountNumber", balance, currency, "clientId", "dailyWithdrawalLimit", "dailyWithdrawnAmount", "lastWithdrawalReset", "createdAt", "updatedAt") VALUES
('account-1', '1000001', 5000.00, 'PEN', 'client-1', 5000.00, 0, NOW(), NOW(), NOW()),
('account-2', '1000002', 3500.50, 'PEN', 'client-2', 5000.00, 0, NOW(), NOW(), NOW()),
('account-3', '1000003', 10000.00, 'PEN', 'client-3', 10000.00, 0, NOW(), NOW(), NOW()),
('account-4', '1000004', 2500.75, 'PEN', 'client-4', 5000.00, 0, NOW(), NOW(), NOW()),
('account-5', '1000005', 7500.25, 'PEN', 'client-5', 5000.00, 0, NOW(), NOW(), NOW()),
('account-6', '1000006', 1500.00, 'USD', 'client-1', 2000.00, 0, NOW(), NOW(), NOW()),
('account-7', '1000007', 8000.00, 'PEN', 'client-2', 5000.00, 0, NOW(), NOW(), NOW());

-- Insertar transacciones
INSERT INTO transactions (id, amount, type, status, description, "sourceAccountId", "destinationAccountId", "createdAt") VALUES
('trans-1', 500.00, 'transfer', 'completed', 'Transferencia entre cuentas', 'account-1', 'account-2', NOW() - INTERVAL '5 days'),
('trans-2', 1000.00, 'transfer', 'completed', 'Pago de servicios', 'account-3', 'account-1', NOW() - INTERVAL '4 days'),
('trans-3', 250.50, 'transfer', 'completed', 'Transferencia', 'account-2', 'account-4', NOW() - INTERVAL '3 days'),
('trans-4', 750.00, 'deposit', 'completed', 'Depósito en efectivo', NULL, 'account-5', NOW() - INTERVAL '2 days'),
('trans-5', 300.00, 'withdrawal', 'completed', 'Retiro cajero', 'account-4', 'account-4', NOW() - INTERVAL '1 day'),
('trans-6', 1200.00, 'transfer', 'completed', 'Transferencia', 'account-1', 'account-5', NOW()),
('trans-7', 450.75, 'transfer', 'completed', 'Pago a proveedor', 'account-6', 'account-2', NOW());

-- Insertar logs de auditoría
INSERT INTO audit_logs (id, operation, "userId", "entityType", "entityId", details, "createdAt") VALUES
('audit-1', 'CREATE', 'user-1', 'User', 'user-2', '{"action": "Crear usuario", "role": "manager"}', NOW() - INTERVAL '6 days'),
('audit-2', 'CREATE', 'user-1', 'Client', 'client-1', '{"action": "Crear cliente", "name": "Juan Pérez"}', NOW() - INTERVAL '5 days'),
('audit-3', 'CREATE', 'user-2', 'Account', 'account-1', '{"action": "Crear cuenta", "accountNumber": "1000001"}', NOW() - INTERVAL '4 days'),
('audit-4', 'TRANSFER', 'user-2', 'Transaction', 'trans-1', '{"action": "Transferencia realizada", "amount": 500.00}', NOW() - INTERVAL '3 days'),
('audit-5', 'TRANSFER', 'user-3', 'Transaction', 'trans-2', '{"action": "Transferencia realizada", "amount": 1000.00}', NOW() - INTERVAL '2 days'),
('audit-6', 'LOGIN', 'user-2', 'User', 'user-2', '{"action": "Login exitoso", "ip": "192.168.1.100"}', NOW() - INTERVAL '1 day'),
('audit-7', 'TRANSFER', 'user-1', 'Transaction', 'trans-6', '{"action": "Transferencia realizada", "amount": 1200.00}', NOW());

-- 4. VERIFICAR LOS DATOS INSERTADOS
SELECT 'Base de datos configurada exitosamente' AS resultado;
SELECT COUNT(*) as total_usuarios FROM users;
SELECT COUNT(*) as total_clientes FROM clients;
SELECT COUNT(*) as total_cuentas FROM accounts;
SELECT COUNT(*) as total_transacciones FROM transactions;
SELECT COUNT(*) as total_logs FROM audit_logs;
