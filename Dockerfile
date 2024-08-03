FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./
COPY nodemon.json ./

RUN yarn install

COPY . .

RUN yarn global add nodemon

EXPOSE 4000

CMD ["nodemon"]