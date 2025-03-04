FROM node:current-bookworm-slim

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm i

COPY . .

EXPOSE 3000
