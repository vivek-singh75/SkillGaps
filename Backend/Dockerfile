FROM node:24-bookworm

WORKDIR /app

COPY package*.json ./

RUN npm ci

RUN apt-get update && apt-get install -y \
    libnspr4 \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_CACHE_DIR=/root/.cache/puppeteer

RUN npx puppeteer browsers install chrome

COPY . .

ENV NODE_ENV=production

EXPOSE 8080

CMD ["npm", "start"]