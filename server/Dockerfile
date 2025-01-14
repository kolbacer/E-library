FROM node:22.13-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server/src ./src
CMD npm run start

EXPOSE 5000