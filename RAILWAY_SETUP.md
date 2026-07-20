# Configuración de Railway - Backend BancoPeru

## ⚠️ IMPORTANTE: Variables de entorno a configurar

Ve a **Railway Dashboard** → Tu proyecto → **Variables** y agrega TODAS estas variables:

### 1. Database
```env
DATABASE_URL=postgresql://neondb_owner:npg_g8aME4ApCfkD@ep-sweet-sound-ajko0sgx-pooler.c-3.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 2. JWT Secrets
```env
JWT_SECRET=42e4f6ba0895a540dc55672a58ddd4d4bb00494a76205ee23963994f42182ccf
REFRESH_TOKEN_SECRET=86748f68c2e2597fb33fcda9ac2011b465a653a958c224673cd83a365abc2b4f
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=7d
```

### 3. Security
```env
BCRYPT_ROUNDS=12
```

### 4. Application
```env
PORT=3000
NODE_ENV=production
API_PREFIX=/api
```

### 5. CORS (⚠️ ACTUALIZAR CON TU DOMINIO DE VERCEL)
```env
CORS_ORIGIN=https://tu-app.vercel.app
CORS_CREDENTIALS=true
```

### 6. Logging
```env
LOG_LEVEL=warn
```

### 7. Prisma/OpenSSL Configuration (CRÍTICO para solucionar errores)
```env
PRISMA_CLI_BINARY_TARGETS=native,linux-musl-openssl-3.0.x
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
OPENSSL_CONF=/dev/null
```

## 📋 Checklist de Deployment

- [ ] 1. **Ejecutar script SQL en Neon**
  - Ir a Neon Console → SQL Editor
  - Ejecutar el contenido de `prisma/neon-full-setup.sql`
  - Verificar que se crearon las 7 tablas

- [ ] 2. **Configurar variables en Railway**
  - Copiar TODAS las variables de arriba
  - Pegarlas en Railway → Settings → Variables
  - Hacer clic en "Add" para cada una

- [ ] 3. **Forzar redeploy limpio**
  - En Railway, ir a Deployments
  - Hacer clic en el menú "..." del último deployment
  - Seleccionar "Redeploy"
  - O hacer un push vacío: `git commit --allow-empty -m "Trigger Railway redeploy" && git push`

- [ ] 4. **Verificar el deployment**
  - Esperar a que termine el build
  - Verificar que no hay errores de OpenSSL/Prisma
  - Copiar la URL del backend (ej: `https://xxx.railway.app`)

- [ ] 5. **Probar el backend**
  - Ir a `https://tu-backend.railway.app/api/health`
  - Debería responder con status 200

## 🔧 Solución de Problemas

### Error: "Could not parse schema engine response"
**Causa:** Prisma no puede generar el cliente por problemas de OpenSSL.

**Solución:**
1. Verifica que hayas agregado las variables de Prisma/OpenSSL (punto 7)
2. Verifica que `Nixpacks.toml` use Node.js 20: `nixPkgs = ['nodejs-20_x']`
3. Haz un redeploy limpio

### Error: "prisma db push failed"
**Causa:** El comando `prisma db push` estaba en el script de inicio.

**Solución:**
1. Verifica que `railway.toml` NO contenga `npx prisma db push`
2. Las tablas ya deben estar creadas en Neon manualmente

### Error: CORS blocked
**Causa:** La variable `CORS_ORIGIN` no está configurada correctamente.

**Solución:**
1. Actualiza `CORS_ORIGIN` con la URL real de tu frontend en Vercel
2. Ejemplo: `CORS_ORIGIN=https://banco-peru.vercel.app`

## 📞 Siguiente Paso

Una vez que Railway deploy exitosamente:
1. Copia la URL del backend
2. Configura esa URL en Vercel como `NEXT_PUBLIC_API_URL`
3. Redeploy el frontend en Vercel

## ✅ Credenciales de Prueba

Una vez que todo esté funcionando:

**Admin/Manager:**
- Usuario: `admin` | Password: `Admin123!`
- Usuario: `carlos` | Password: `Admin123!`

**Clientes:**
- DNI: `12345678` | Password: `Client123!`
- DNI: `87654321` | Password: `Client123!`
