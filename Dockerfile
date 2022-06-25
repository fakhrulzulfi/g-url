FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN yarn install --ignore-engines

COPY . ./

EXPOSE 1337