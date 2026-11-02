FROM node:18-alpine

WORKDIR /app

COPY package.json ./

RUN npm install --production

COPY index.html server.js ./

EXPOSE 10000

CMD ["node", "server.js"]
