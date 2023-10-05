FROM node:alpine as production

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --only=production

COPY . .

RUN yarn build images-ms

CMD sh -c "node ./dist/apps/payments/main"