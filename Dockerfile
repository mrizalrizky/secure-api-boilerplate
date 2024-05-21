# Base Image
FROM node:20-alpine

WORKDIR /secure-api-app

COPY . .

RUN npm install

CMD [ "node", "server.js"]