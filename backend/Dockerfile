FROM node:18.18.0
ADD ./dist /app
ADD ./package.json /app
ADD ./package-lock.json /app
WORKDIR /app

RUN npm i --only=production

EXPOSE 3000

CMD ["node", "app.bundle.js"]