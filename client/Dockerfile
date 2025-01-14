FROM node:22.13-alpine
WORKDIR /app
COPY client/package*.json ./
RUN npm install
COPY client/src ./src
COPY client/public ./public
CMD npm run start

EXPOSE 3000