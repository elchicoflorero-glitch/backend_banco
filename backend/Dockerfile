FROM node:18-bookworm-slim

WORKDIR /app

# Install required system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy only package files (no source code yet)
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies WITHOUT triggering postinstall
RUN npm ci --ignore-scripts

# Copy source code
COPY . .

# Build the application (this does NOT generate Prisma)
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

EXPOSE 3000

# On startup: clean, generate Prisma, then start
CMD ["sh", "-c", "rm -rf node_modules/.prisma node_modules/@prisma && npx prisma generate && npx prisma db push --skip-generate && npm run start:prod"]