FROM node:18-bookworm-slim

WORKDIR /app

# Install required dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy package files ONLY
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Build the application
RUN npm run build

EXPOSE 3000

# Start the application - Regenerate Prisma at runtime to avoid caching issues
CMD ["sh", "-c", "rm -rf node_modules/.prisma && npx prisma generate && npx prisma db push && npm run start:prod"]