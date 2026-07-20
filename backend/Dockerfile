FROM node:18-bookworm-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --ignore-scripts

COPY . .

RUN npm run build

RUN npm prune --production

EXPOSE 3000

CMD ["npm", "run", "start:prod"]