const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function createTables() {
  try {
    console.log('📦 Creando tablas desde schema.prisma...\n');
    
    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, 'prisma', 'neon-full-setup.sql');
    
    if (fs.existsSync(sqlPath)) {
      console.log('✅ Encontrado neon-full-setup.sql, ejecutando...');
      const sql = fs.readFileSync(sqlPath, 'utf8');
      
      // Ejecutar el SQL
      await prisma.$executeRawUnsafe(sql);
      console.log('✅ Tablas creadas desde neon-full-setup.sql\n');
    } else {
      console.log('⚠️  neon-full-setup.sql no encontrado, usando Prisma para crear tablas...\n');
      
      // SQL generado desde el schema.prisma
      const createTablesSQL = `
        -- CreateTable
        CREATE TABLE IF NOT EXISTS "users" (
            "id" TEXT NOT NULL,
            "username" TEXT NOT NULL,
            "email" TEXT NOT NULL,
            "password" TEXT NOT NULL,
            "role" TEXT NOT NULL DEFAULT 'user',
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,

            CONSTRAINT "users_pkey" PRIMARY KEY ("id")
        );

        -- CreateTable
        CREATE TABLE IF NOT EXISTS "clients" (
            "id" TEXT NOT NULL,
            "user_id" TEXT,
            "dni" TEXT NOT NULL,
            "firstName" TEXT NOT NULL,
            "lastName" TEXT NOT NULL,
            "email" TEXT NOT NULL,
            "phone" TEXT NOT NULL,
            "password" TEXT NOT NULL,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,

            CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
        );

        -- CreateTable
        CREATE TABLE IF NOT EXISTS "accounts" (
            "id" TEXT NOT NULL,
            "accountNumber" TEXT NOT NULL,
            "balance" DECIMAL(15,2) NOT NULL DEFAULT 0,
            "currency" TEXT NOT NULL DEFAULT 'PEN',
            "clientId" TEXT NOT NULL,
            "dailyWithdrawalLimit" DECIMAL(15,2) NOT NULL DEFAULT 5000,
            "dailyWithdrawnAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
            "lastWithdrawalReset" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,

            CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
        );

        -- CreateTable
        CREATE TABLE IF NOT EXISTS "transactions" (
            "id" TEXT NOT NULL,
            "amount" DECIMAL(15,2) NOT NULL,
            "sourceAccountId" TEXT,
            "destinationAccountId" TEXT NOT NULL,
            "type" TEXT NOT NULL DEFAULT 'transfer',
            "status" TEXT NOT NULL DEFAULT 'completed',
            "description" TEXT,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
        );

        -- CreateTable
        CREATE TABLE IF NOT EXISTS "audit_logs" (
            "id" TEXT NOT NULL,
            "operation" TEXT NOT NULL,
            "userId" TEXT,
            "entityType" TEXT,
            "entityId" TEXT,
            "details" JSONB,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
        );

        -- CreateTable
        CREATE TABLE IF NOT EXISTS "otp_requests" (
            "id" TEXT NOT NULL,
            "accountId" TEXT NOT NULL,
            "code" TEXT NOT NULL,
            "type" TEXT NOT NULL,
            "expiresAt" TIMESTAMP(3) NOT NULL,
            "isUsed" BOOLEAN NOT NULL DEFAULT false,
            "usedAt" TIMESTAMP(3),
            "attempts" INTEGER NOT NULL DEFAULT 0,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT "otp_requests_pkey" PRIMARY KEY ("id")
        );

        -- CreateTable
        CREATE TABLE IF NOT EXISTS "pdf_reports" (
            "id" TEXT NOT NULL,
            "accountId" TEXT NOT NULL,
            "reportType" TEXT NOT NULL,
            "fileName" TEXT NOT NULL,
            "s3Path" TEXT,
            "fileSize" INTEGER,
            "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "expiresAt" TIMESTAMP(3) NOT NULL,
            "downloadCount" INTEGER NOT NULL DEFAULT 0,
            "lastDownloadAt" TIMESTAMP(3),
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT "pdf_reports_pkey" PRIMARY KEY ("id")
        );

        -- CreateIndex
        CREATE UNIQUE INDEX IF NOT EXISTS "users_username_key" ON "users"("username");
        CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
        CREATE UNIQUE INDEX IF NOT EXISTS "clients_dni_key" ON "clients"("dni");
        CREATE UNIQUE INDEX IF NOT EXISTS "accounts_accountNumber_key" ON "accounts"("accountNumber");
        CREATE UNIQUE INDEX IF NOT EXISTS "otp_requests_code_key" ON "otp_requests"("code");

        -- AddForeignKey
        ALTER TABLE "clients" ADD CONSTRAINT "clients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
        ALTER TABLE "accounts" ADD CONSTRAINT "accounts_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
        ALTER TABLE "transactions" ADD CONSTRAINT "transactions_sourceAccountId_fkey" FOREIGN KEY ("sourceAccountId") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
        ALTER TABLE "transactions" ADD CONSTRAINT "transactions_destinationAccountId_fkey" FOREIGN KEY ("destinationAccountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
        ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
        ALTER TABLE "otp_requests" ADD CONSTRAINT "otp_requests_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      `;
      
      await prisma.$executeRawUnsafe(createTablesSQL);
      console.log('✅ Tablas creadas exitosamente\n');
    }
    
    // Verificar que las tablas se crearon
    console.log('🔍 Verificando tablas creadas...\n');
    const userCount = await prisma.user.count();
    const clientCount = await prisma.client.count();
    const accountCount = await prisma.account.count();
    
    console.log(`✅ users: ${userCount} registros`);
    console.log(`✅ clients: ${clientCount} registros`);
    console.log(`✅ accounts: ${accountCount} registros`);
    console.log('\n✅ Base de datos lista para usar!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

createTables();
