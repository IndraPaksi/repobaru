FROM node:alpine

WORKDIR /src/

EXPOSE 4000

CMD npm install && npm start