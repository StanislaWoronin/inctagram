FROM node:alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

COPY prisma .libs/providers/prisma/

RUN yarn

RUN yarn install

COPY . .

RUN yarn build main-app

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

COPY prisma .libs/providers/prisma/

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["yarn", "dist/apps/nain-app/main"]