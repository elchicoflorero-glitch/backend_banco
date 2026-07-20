FROM node:18-alpine3.18

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy configuration files
COPY tsconfig.json ./
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --ignore-scripts

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY src ./src/

# Build the application
RUN npm run build

# Clean up and install production dependencies only
RUN npm prune --production

EXPOSE 3000

CMD ["npm", "run", "start:prod"]