FROM node:20-slim as pre-build-stage

WORKDIR /usr/local/build/

COPY ["package*.json", "./"]
RUN npm install

COPY src/ ./src/
COPY ["./*.json", "./"]
COPY ["./*.ts", "./"]
COPY ["./.env", "./"]

RUN npm run build
RUN npm prune --production

FROM node:20-alpine as build-stage

RUN apk add -U tzdata
ENV TZ=America/Sao_Paulo
RUN cp /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime

WORKDIR /usr/local/app/

COPY --from=pre-build-stage /usr/local/build/dist/ ./dist/
COPY --from=pre-build-stage /usr/local/build/node_modules/ ./node_modules/
COPY package.json .

CMD npm run start:prod

