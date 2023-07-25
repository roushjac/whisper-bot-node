FROM node:latest

WORKDIR /usr/src/bot

COPY package*.json ./

RUN npm install -g node-gyp node-pre-gyp
RUN npm install

COPY . .

EXPOSE 8080

# CMD [ "node", "index.js" ]