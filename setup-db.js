const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setupDatabase() {
  try {
    console.log('📦 Creando tablas en Neon Database...\n');
    
    const commands = [
      // Users table
      `CREATE TABLE IF NOT EXISTS "users" (
        "id" TEXT NOT NULL,
        "username" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'user',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "users_pkey" PRIMARY KEY ("id")
      )`,
      
      // Clients table
      `CREATE TABLE IF NOT EXISTS "clients" (
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
      )`,
      
      // Accounts table
      `CREATE TABLE IF NOT EXISTS "accounts" (
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
      )`,
      
      // Transactions table
      `CREATE TABLE IF NOT EXISTS "transactions" (
        "id" TEXT NOT NULL,
        "amount" DECIMAL(15,2) NOT NULL,
        "sourceAccountId" TEXT,
        "destinationAccountId" TEXT NOT NULL,
        "type" TEXT NOT NULL DEFAULT 'transfer',
        "status" TEXT NOT NULL DEFAULT 'completed',
        "description" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
      )`,
      
      // Audit logs table
      `CREATE TABLE IF NOT EXISTS "audit_logs" (
        "id" TEXT NOT NULL,
        "operation" TEXT NOT NULL,
        "userId" TEXT,
        "entityType" TEXT,
        "entityId" TEXT,
        "details" JSONB,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
      )`,
      
      // OTP requests table
      `CREATE TABLE IF NOT EXISTS "otp_requests" (
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
      )`,
      
      // PDF reports table
      `CREATE TABLE IF NOT EXISTS "pdf_reports" (
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
      )`
    ];
    
    console.log('🔨 Creando tablas...');
    for (const cmd of commands) {
      await prisma.$executeRawUnsafe(cmd);
    }
    console.log('✅ Tablas creadas\n');
    
    // Create indexes
    console.log('🔨 Creando índices...');
    const indexes = [
      'CREATE UNIQUE INDEX IF NOT EXISTS "users_username_key" ON "users"("username")',
      'CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email")',
      'CREATE UNIQUE INDEX IF NOT EXISTS "clients_dni_key" ON "clients"("dni")',
      'CREATE UNIQUE INDEX IF NOT EXISTS "accounts_accountNumber_key" ON "accounts"("accountNumber")',
      'CREATE UNIQUE INDEX IF NOT EXISTS "otp_requests_code_key" ON "otp_requests"("code")'
    ];
    
    for (const idx of indexes) {
      await prisma.$executeRawUnsafe(idx);
    }
    console.log('✅ Índices creados\n');
    
    // Add foreign keys
    console.log('🔨 Creando relaciones (foreign keys)...');
    const foreignKeys = [
      'ALTER TABLE "clients" DROP CONSTRAINT IF EXISTS "clients_user_id_fkey"',
      'ALTER TABLE "clients" ADD CONSTRAINT "clients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE',
      'ALTER TABLE "accounts" DROP CONSTRAINT IF EXISTS "accounts_clientId_fkey"',
      'ALTER TABLE "accounts" ADD CONSTRAINT "accounts_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE',
      'ALTER TABLE "transactions" DROP CONSTRAINT IF EXISTS "transactions_sourceAccountId_fkey"',
      'ALTER TABLE "transactions" ADD CONSTRAINT "transactions_sourceAccountId_fkey" FOREIGN KEY ("sourceAccountId") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE',
      'ALTER TABLE "transactions" DROP CONSTRAINT IF EXISTS "transactions_destinationAccountId_fkey"',
      'ALTER TABLE "transactions" ADD CONSTRAINT "transactions_destinationAccountId_fkey" FOREIGN KEY ("destinationAccountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE',
      'ALTER TABLE "audit_logs" DROP CONSTRAINT IF EXISTS "audit_logs_userId_fkey"',
      'ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE',
      'ALTER TABLE "otp_requests" DROP CONSTRAINT IF EXISTS "otp_requests_accountId_fkey"',
      'ALTER TABLE "otp_requests" ADD CONSTRAINT "otp_requests_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE'
    ];
    
    for (const fk of foreignKeys) {
      try {
        await prisma.$executeRawUnsafe(fk);
      } catch (error) {
        // Ignorar errores si ya existen
        if (!error.message.includes('already exists')) {
          console.log(`⚠️  ${error.message}`);
        }
      }
    }
    console.log('✅ Relaciones creadas\n');
    
    // Verify
    console.log('🔍 Verificando tablas...\n');
    const userCount = await prisma.user.count();
    const clientCount = await prisma.client.count();
    const accountCount = await prisma.account.count();
    
    console.log(`✅ users: ${userCount} registros`);
    console.log(`✅ clients: ${clientCount} registros`);
    console.log(`✅ accounts: ${accountCount} registros`);
    console.log('\n🎉 ¡Base de datos configurada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();
