FROM node:alpine

RUN apk update && apk add ca-certificates openssl && update-ca-certificates

RUN mkdir /app
ADD . /app
WORKDIR /app

RUN yarn install
CMD yarn dev