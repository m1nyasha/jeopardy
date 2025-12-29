FROM node:20-alpine3.18

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src

RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "start:prod"]

