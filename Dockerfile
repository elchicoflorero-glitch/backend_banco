FROM node:18-alpine3.18

WORKDIR /app

# Instalar dependencias del sistema
RUN apk add --no-cache python3 make g++

# Copiar archivos de configuración del backend
COPY backend/tsconfig.json ./
COPY backend/package*.json ./
COPY backend/prisma ./prisma/
COPY backend/src ./src/

# Instalar dependencias
RUN npm ci --ignore-scripts

# Generar cliente Prisma
RUN npx prisma generate

# Compilar la aplicación
RUN npm run build

# Prune dependencies para producción
RUN npm ci --ignore-scripts --production

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
