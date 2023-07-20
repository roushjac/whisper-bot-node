FROM node:latest

WORKDIR /usr/src/bot

COPY package*.json ./

RUN npm install

COPY . .

# EXPOSE 5000

# CMD [ "node", "index.js" ]