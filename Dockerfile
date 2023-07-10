# FROM alpine:3.13.5
USER root

RUN curl -fsSLO https://get.docker.com/builds/Linux/x86_64/docker-17.04.0-ce.tgz \
  && tar xzvf docker-17.04.0-ce.tgz \
  && mv docker/docker /usr/local/bin \
  && rm -r docker docker-17.04.0-ce.tgz

#Build process
FROM node:16-alpine as builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build

#Production process
FROM node:16-alpine

WORKDIR /app

COPY package.json .

RUN npm install --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 4000
CMD ["npm","run","start"]
