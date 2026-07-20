# Configuración de Railway para Backend

## Variables de Entorno a Configurar en Railway

Ve a tu proyecto en Railway → Settings → Variables y agrega las siguientes:

### 1. Database
```
DATABASE_URL=postgresql://neondb_owner:npg_g8aME4ApCfkD@ep-sweet-sound-ajko0sgx-pooler.c-3.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 2. JWT Secrets (CRÍTICO - Guarda estos valores de forma segura)
```
JWT_SECRET=42e4f6ba0895a540dc55672a58ddd4d4bb00494a76205ee23963994f42182ccf
REFRESH_TOKEN_SECRET=86748f68c2e2597fb33fcda9ac2011b465a653a958c224673cd83a365abc2b4f
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=7d
```

### 3. Security
```
BCRYPT_ROUNDS=12
```

### 4. Application
```
PORT=3000
NODE_ENV=production
API_PREFIX=/api
```

### 5. CORS (Actualiza con tu dominio de Vercel)
```
CORS_ORIGIN=https://tu-app.vercel.app
CORS_CREDENTIALS=true
```

### 6. Logging
```
LOG_LEVEL=warn
```

### 7. Email (Gmail SMTP - NUEVO)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=carlos.daniel.proa@gmail.com
SMTP_PASSWORD=kkcf gqko sbhr fgeq
SMTP_FROM_EMAIL=noreply@bancoperu.com
FRONTEND_URL=https://fronted-banco.vercel.app
```

**⚠️ IMPORTANTE**: La contraseña es un **Gmail App Password**, no la contraseña de tu cuenta. Fue generada en: https://myaccount.google.com/apppasswords

## Pasos para Desplegar en Railway

1. **Conectar Repositorio**
   - Ve a Railway Dashboard
   - Clic en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Busca y selecciona: `elchicoflorero-glitch/backend_banco`

2. **Configurar Variables de Entorno**
   - En el proyecto de Railway, ve a Settings → Variables
   - Copia y pega todas las variables de arriba
   - Guarda los cambios

3. **Configurar el Build**
   Railway detectará automáticamente que es un proyecto NestJS y usará:
   - Build Command: `npm run build`
   - Start Command: `npm run start:prod`

4. **Inicializar Base de Datos**
   Una vez desplegado, ejecuta desde Railway CLI o Shell:
   ```bash
   npm run prisma:generate
   npx prisma db push
   ```

5. **Seed de Datos (Opcional)**
   Si necesitas datos iniciales:
   ```bash
   psql $DATABASE_URL < prisma/complete-setup.sql
   ```

6. **Obtener URL del Backend**
   - Railway te dará una URL como: `https://backend-banco-production.up.railway.app`
   - Copia esta URL

7. **Actualizar Frontend en Vercel**
   - Ve a tu proyecto en Vercel
   - Settings → Environment Variables
   - Actualiza `NEXT_PUBLIC_API_URL` con la URL de Railway
   - Redeploy el frontend

## Verificación

Prueba estos endpoints para verificar que funciona:

```bash
# Health Check
https://tu-backend.railway.app/api/health

# Login
curl -X POST https://tu-backend.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@banco.com","password":"tu_password"}'
```

## Comandos Útiles de Railway CLI

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Ver logs
railway logs

# Conectar a la base de datos
railway run psql $DATABASE_URL
```

## Notas Importantes

⚠️ **SEGURIDAD:**
- Nunca compartas los secrets JWT públicamente
- Los valores generados son únicos para tu producción
- Cambia las credenciales si se exponen

⚠️ **CORS:**
- Actualiza `CORS_ORIGIN` con tu dominio real de Vercel
- Múltiples dominios: `https://dominio1.com,https://dominio2.com`

⚠️ **Base de Datos:**
- La conexión usa Neon (PostgreSQL serverless)
- Asegúrate de que el pool de conexiones esté configurado
- Neon incluye connection pooling por defecto
