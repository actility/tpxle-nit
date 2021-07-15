FROM node:16-alpine

RUN mkdir -p /opt/tpxle-nit/src
RUN mkdir -p /opt/tpxle-nit/config
RUN mkdir -p /opt/tpxle-nit/log

WORKDIR /opt/tpxle-nit/src

COPY ./src .
RUN npm install

CMD ["npm", "start"]
