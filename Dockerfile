# Build Stage
FROM node:18-alpine3.18 AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ && \
    npm install -g @nestjs/cli

# Copy and install dependencies first
COPY backend/package*.json ./
RUN npm ci

# Copy prisma and generate client
COPY backend/prisma ./prisma/
RUN npx prisma generate

# Copy source and build
COPY backend/src ./src/
COPY backend/tsconfig.json ./
RUN npm run build

# Runtime Stage
FROM node:18-alpine3.18

WORKDIR /app

# Only install runtime dependencies
RUN apk add --no-cache openssl

# Copy from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY backend/package*.json ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/main"]
