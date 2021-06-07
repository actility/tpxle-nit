FROM node:16.2.0-alpine3.11

RUN mkdir -p /usr/src/nit
RUN mkdir -p /var/log/nit

WORKDIR /usr/src/app

COPY ./src .

RUN npm install

CMD ["npm", "start"]
