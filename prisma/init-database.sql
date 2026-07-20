-- Script para crear la base de datos y tablas de Banco Perú
-- Ejecuta este script manualmente en PostgreSQL

-- 1. Crear la base de datos (si no existe)
CREATE DATABASE banco_peru;

-- Conectarse a la base de datos banco_peru antes de ejecutar lo siguiente

-- 2. Crear las tablas

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    dni TEXT UNIQUE NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de cuentas
CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    "accountNumber" TEXT UNIQUE NOT NULL,
    balance NUMERIC(15, 2) NOT NULL DEFAULT 0,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "accounts_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES clients(id)
);

-- Tabla de transacciones
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    amount NUMERIC(15, 2) NOT NULL,
    "sourceAccountId" TEXT NOT NULL,
    "destinationAccountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "transactions_sourceAccountId_fkey" FOREIGN KEY ("sourceAccountId") REFERENCES accounts(id),
    CONSTRAINT "transactions_destinationAccountId_fkey" FOREIGN KEY ("destinationAccountId") REFERENCES accounts(id)
);

-- Tabla de auditoría
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    operation TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    details JSONB,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES users(id)
);

-- 3. Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS "idx_accounts_clientId" ON accounts("clientId");
CREATE INDEX IF NOT EXISTS "idx_transactions_sourceAccountId" ON transactions("sourceAccountId");
CREATE INDEX IF NOT EXISTS "idx_transactions_destinationAccountId" ON transactions("destinationAccountId");
CREATE INDEX IF NOT EXISTS "idx_audit_logs_userId" ON audit_logs("userId");
CREATE INDEX IF NOT EXISTS "idx_audit_logs_createdAt" ON audit_logs("createdAt");

-- Script completado exitosamente
