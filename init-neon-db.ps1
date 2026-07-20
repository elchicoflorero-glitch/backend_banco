# Script para inicializar la base de datos Neon
Write-Host "Inicializando base de datos Neon..." -ForegroundColor Green

# Configurar la DATABASE_URL de Neon
$env:DATABASE_URL="postgresql://neondb_owner:npg_g8aME4ApCfkD@ep-sweet-sound-ajko0sgx-pooler.c-3.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Empujar el schema a la base de datos
Write-Host "Empujando schema de Prisma..." -ForegroundColor Yellow
npx prisma db push --accept-data-loss

# Ejecutar el script de setup completo
Write-Host "Ejecutando scripts SQL de inicialización..." -ForegroundColor Yellow
$env:PGPASSWORD="npg_g8aME4ApCfkD"
psql "postgresql://neondb_owner@ep-sweet-sound-ajko0sgx-pooler.c-3.us-east-2.aws.neon.tech/neondb?sslmode=require" -f prisma/complete-setup.sql

Write-Host "Base de datos inicializada!" -ForegroundColor Green
