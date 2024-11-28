FROM node:20-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN apt-get update -y && \
    apt install -y wget netcat-traditional && \
    wget -q -O /usr/bin/wait-for https://raw.githubusercontent.com/eficode/wait-for/v2.2.3/wait-for && \
    chmod +x /usr/bin/wait-for && \
    npm install

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:prod" ]