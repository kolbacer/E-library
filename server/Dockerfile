FROM node:latest
WORKDIR /app
COPY ./package.json ./
RUN yarn install
COPY . .
EXPOSE 5000
CMD ["node", "index.js"]