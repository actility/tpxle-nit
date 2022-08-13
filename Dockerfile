FROM node:18-alpine

RUN mkdir -p /opt/tpxle-nit/src

WORKDIR /opt/tpxle-nit/src

COPY ./src .
RUN npm install

CMD ["npm", "start"]
