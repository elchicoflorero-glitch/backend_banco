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

# Install dependencies
RUN npm ci --production=false

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Remove dev dependencies for production
RUN npm prune --production

EXPOSE 3000

# Start the application
CMD ["sh", "-c", "npx prisma db push && npm run start:prod"]