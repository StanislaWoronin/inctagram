FROM node:alpine as production

WORKDIR /usr/src/app

COPY . .

RUN yarn install --only=production

RUN yarn prisma:gen

RUN npx tsc

CMD ["node", "dist/apps/main-app/main"]