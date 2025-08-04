# Use official Node.js LTS image
FROM node:22-bullseye

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:prod"]


