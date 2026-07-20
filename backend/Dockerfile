FROM node:18-alpine

WORKDIR /app

# Install OpenSSL 1.1 and other required dependencies for Prisma
RUN apk add --no-cache \
    openssl1.1-compat \
    openssl \
    ca-certificates \
    python3 \
    make \
    g++

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