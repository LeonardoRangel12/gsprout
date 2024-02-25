FROM node:18.18.0
ADD ./dist /app
WORKDIR /app

EXPOSE 3000

CMD ["node", "app.bundle.js"]