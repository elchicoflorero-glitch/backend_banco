FROM node:18-bookworm-slim

WORKDIR /app

# Install required dependencies (Debian-based, includes OpenSSL by default)
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Clear npm cache before install
RUN npm cache clean --force

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Clear Prisma cache
RUN rm -rf node_modules/.prisma

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

EXPOSE 3000

# Start the application
CMD ["sh", "-c", "npx prisma db push && npm run start:prod"]