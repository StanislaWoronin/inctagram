FROM node:alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn

RUN yarn install

COPY . .

RUN yarn build file-storage

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["yarn", "dist/apps/file-storage/main"]