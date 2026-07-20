# Build stage
FROM node:18-alpine3.18 AS builder

# Install build dependencies including OpenSSL 1.1
RUN apk add --no-cache python3 make g++ libc-dev openssl1.1-compat

WORKDIR /app

# Copy package files from backend
COPY backend/package*.json ./

# Install dependencies
RUN npm ci

# Copy prisma schema
COPY backend/prisma ./prisma

# Copy source code
COPY backend/src ./src
COPY backend/tsconfig.json ./
COPY backend/nest-cli.json ./

# Generate Prisma Client
RUN npm run prisma:generate

# Build the app
RUN npm run build

# Runtime stage
FROM node:18-alpine3.18

WORKDIR /app

# Install OpenSSL 1.1 for Prisma runtime
RUN apk add --no-cache openssl1.1-compat

# Copy package files
COPY backend/package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy prisma schema
COPY backend/prisma ./prisma

# Generate Prisma Client for runtime
RUN npm run prisma:generate

# Copy built app from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "dist/main.js"]
