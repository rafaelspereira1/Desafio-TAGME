# Use official Node.js LTS image
FROM node:22-bullseye

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install -g @nestjs/cli

COPY . .

RUN nest build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]


