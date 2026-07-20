FROM node:18-alpine3.18

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat python3 make g++

COPY backend/package*.json ./

RUN npm ci --omit=dev

COPY backend/prisma ./prisma/

RUN npx prisma generate

COPY backend/src ./src/
COPY backend/tsconfig.json ./

RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/main"]
