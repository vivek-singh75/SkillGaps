FROM node:24-bookworm

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV NODE_ENV=production

EXPOSE 8080

CMD ["npm", "start"]