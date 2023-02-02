FROM node:18.12.1-alpine

WORKDIR /app

COPY . /app

RUN mv .env.example .env
RUN yarn install 

EXPOSE 3000

CMD yarn dev
