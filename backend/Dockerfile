FROM node:18-bookworm-slim

WORKDIR /app

# Install required system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy only package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies WITHOUT triggering postinstall
RUN npm ci --ignore-scripts

# Copy source code
COPY . .

# Generate Prisma with explicit binary target
RUN PRISMA_CLI_QUERY_ENGINE_TYPE=binary npx prisma generate

# Build the application
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

EXPOSE 3000

# On startup: just start (Prisma already generated)
CMD ["npm", "run", "start:prod"]