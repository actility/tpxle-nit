FROM node:16-alpine

RUN mkdir -p /usr/src/nit
RUN mkdir -p /var/log/nit

WORKDIR /usr/src/app

COPY ./src .

RUN npm install

CMD ["npm", "start"]
