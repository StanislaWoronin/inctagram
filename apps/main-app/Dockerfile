FROM node:alpine as production

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY prisma/ ./prisma/

RUN yarn install --only=production

COPY . .

RUN yarn prisma:gen

COPY --from=development /usr/src/app/dist ./dist

CMD sh -c "yarn prisma:migrate && node ./dist/apps/main-app/main"