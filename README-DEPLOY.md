# 🏦 BancoPeru - Backend API

API REST construida con NestJS + PostgreSQL + Prisma ORM

## 🚀 Deploy en Railway + Neon

### 1. Base de Datos (Neon)
1. Ir a https://neon.tech/ y crear cuenta
2. Crear nuevo proyecto "BancoPeru"
3. Copiar el **Connection String** (con Pooling activado)

### 2. Backend (Railway)
1. Ir a https://railway.app/ y crear cuenta
2. **New Project** → **Deploy from GitHub repo**
3. Seleccionar `bancoperu-backend`
4. **Variables de entorno**:
   ```
   DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require
   JWT_SECRET=un_secreto_muy_largo_minimo_32_caracteres_aqui
   PORT=3001
   NODE_ENV=production
   ```
5. Deploy automático se ejecutará

### 3. Verificar Deploy
- Railway te dará una URL: `https://bancoperu-backend-production.up.railway.app`
- Probar: `https://tu-url.railway.app/api` (Swagger docs)

## 🔧 Desarrollo Local

```bash
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```

Servidor corriendo en: http://localhost:3001

## 📝 Variables de Entorno

Crear archivo `.env`:

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/bancoperu?schema=public"
JWT_SECRET="desarrollo_secreto_local"
PORT=3001
NODE_ENV="development"
```

## 📚 Endpoints Principales

- `GET /api` - Swagger documentation
- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Login
- `GET /clients` - Listar clientes (Auth)
- `POST /transfers` - Realizar transferencia (Auth)
- `GET /audit-logs` - Ver auditoría (Auth)

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run start:dev

# Build para producción
npm run build

# Iniciar producción
npm run start:prod

# Prisma
npx prisma studio        # UI para ver la BD
npx prisma generate      # Generar cliente Prisma
npx prisma db push       # Sincronizar schema con BD
```

## 📦 Stack Técnico

- **Framework**: NestJS 10
- **Base de Datos**: PostgreSQL (Neon)
- **ORM**: Prisma 5
- **Autenticación**: JWT + Passport
- **Validación**: class-validator
- **Documentación**: Swagger/OpenAPI

## 🔒 Seguridad

- Passwords hasheados con bcryptjs
- JWT con expiración de 24h
- CORS configurado para frontend
- Validación de entrada en todos los endpoints
- Auditoría completa de operaciones

## 📊 Base de Datos

### Tablas Principales:
- `users` - Usuarios del sistema
- `clients` - Clientes del banco
- `accounts` - Cuentas bancarias
- `transactions` - Transacciones
- `audit_logs` - Log de auditoría (inmutable)

## 🐛 Troubleshooting

### Error: "Cannot find module '@prisma/client'"
```bash
npx prisma generate
```

### Error: Database connection failed
Verificar que `DATABASE_URL` tiene el formato correcto y que Neon está activo.

### Error: Port already in use
Railway usa puerto dinámico. En local, cambiar `PORT` en `.env`.
