FROM node:18-alpine

WORKDIR /app

RUN echo '{"name":"gemini-proxy","version":"1.0.0","dependencies":{"express":"^4.19.2","duckduckgo-chat-interface":"^0.0.8"}}' > package.json

RUN npm install --production

COPY index.html server.js ./

EXPOSE 10000

CMD ["node", "server.js"]
