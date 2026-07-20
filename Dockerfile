# Build stage
FROM node:18-alpine AS builder

# Install OpenSSL and build dependencies
RUN apk add --no-cache openssl openssl-dev python3 make g++ libc-dev

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY backend . 

# Generate Prisma Client
RUN npm run prisma:generate

# Build the app
RUN npm run build

# Runtime stage
FROM node:18-alpine

# Install OpenSSL runtime libraries
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Generate Prisma Client for runtime
RUN npm run prisma:generate

# Copy built app from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "dist/main.js"]
