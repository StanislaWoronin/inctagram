
FROM node:18-alpine

WORKDIR /user/src/app

COPY . .

RUN yarn

RUN yarn prisma:gen

RUN yarn prisma:migrate

RUN yarn build

USER node

CMD ["yarn", "start:app"]